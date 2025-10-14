import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, View, Text, TouchableOpacity, Alert, Share, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { storageService } from '../services/storage';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

interface AppSettings {
  notifications: boolean;
  autoBackup: boolean;
  theme: 'light' | 'dark';
  language: string;
}

const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<SettingsScreenProps['navigation']>();
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    autoBackup: true,
    theme: 'light',
    language: 'pt-BR',
  });
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState<any>(null);

  const loadSettings = async () => {
    try {
      const appSettings = await storageService.getAppSettings();
      setSettings(appSettings);
      
      const info = await storageService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await storageService.updateAppSettings({ [key]: value });
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      Alert.alert('Erro', 'Não foi possível salvar a configuração');
    }
  };

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      const backup = await storageService.createBackup();
      
      const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`;
      
      await Share.share({
        message: backup,
        title: `Backup do App - ${fileName}`,
      });
      
      Alert.alert('Sucesso', 'Backup criado e compartilhado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      Alert.alert('Erro', 'Não foi possível criar o backup');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá limpar o cache da aplicação. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              storageService.clearCache();
              await loadSettings();
              Alert.alert('Sucesso', 'Cache limpo com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar o cache');
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = async () => {
    Alert.alert(
      'Apagar Todos os Dados',
      'ATENÇÃO: Isso irá apagar TODOS os dados da aplicação permanentemente. Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'APAGAR TUDO',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              'Confirmação Final',
              'Tem certeza absoluta? Todos os dados serão perdidos!',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'SIM, APAGAR',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await storageService.clearAll();
                      Alert.alert('Concluído', 'Todos os dados foram apagados. O app será reiniciado.', [
                        { text: 'OK', onPress: () => signOut() }
                      ]);
                    } catch (error) {
                      Alert.alert('Erro', 'Não foi possível apagar os dados');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderTitle>Configurações</HeaderTitle>
          <HeaderSubtitle>Gerencie suas preferências</HeaderSubtitle>
        </Header>
        <LoadingContainer>
          <ActivityIndicator size="large" color={props => props.theme.colors.primary} />
          <LoadingText>Carregando configurações...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Configurações</HeaderTitle>
        <HeaderSubtitle>Gerencie suas preferências</HeaderSubtitle>
      </Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SectionTitle>Preferências</SectionTitle>
        <SettingsCard>
          <SettingItem>
            <SettingInfo>
              <SettingTitle>Notificações</SettingTitle>
              <SettingDescription>Receber notificações push</SettingDescription>
            </SettingInfo>
            <CustomSwitch
              value={settings.notifications}
              onValueChange={(value) => updateSetting('notifications', value)}
            />
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingTitle>Backup Automático</SettingTitle>
              <SettingDescription>Criar backups automaticamente</SettingDescription>
            </SettingInfo>
            <CustomSwitch
              value={settings.autoBackup}
              onValueChange={(value) => updateSetting('autoBackup', value)}
            />
          </SettingItem>
        </SettingsCard>

        <SectionTitle>Dados e Armazenamento</SectionTitle>
        <SettingsCard>
          {storageInfo && (
            <>
              <InfoItem>
                <InfoLabel>Itens no Cache:</InfoLabel>
                <InfoValue>{storageInfo.cacheSize}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Total de Chaves:</InfoLabel>
                <InfoValue>{storageInfo.totalKeys}</InfoValue>
              </InfoItem>
            </>
          )}
        </SettingsCard>

        <BackupButton onPress={handleCreateBackup} disabled={loading}>
          <Ionicons name="download" size={20} color="#fff" />
          <ButtonText>Criar Backup</ButtonText>
        </BackupButton>

        <CacheButton onPress={handleClearCache}>
          <Ionicons name="trash" size={20} color="#fff" />
          <ButtonText>Limpar Cache</ButtonText>
        </CacheButton>

        <SectionTitle>Ações Perigosas</SectionTitle>
        <DangerButton onPress={handleClearAllData}>
          <Ionicons name="warning" size={20} color="#fff" />
          <ButtonText>Apagar Todos os Dados</ButtonText>
        </DangerButton>

        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#0066CC" />
          <ButtonText>Voltar</ButtonText>
        </BackButton>
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.View`
  background-color: ${props => props.theme.colors.primary};
  padding-horizontal: ${props => props.theme.spacing.lg}px;
  padding-vertical: ${props => props.theme.spacing.lg}px;
  padding-top: ${props => props.theme.spacing.xl}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 4;
`;

const HeaderTitle = styled.Text`
  font-size: ${props => props.theme.typography.heading.fontSize}px;
  font-weight: ${props => props.theme.typography.heading.fontWeight};
  color: ${props => props.theme.colors.white};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const HeaderSubtitle = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.white};
  opacity: 0.9;
  text-align: center;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const SectionTitle = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg}px;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const SettingsCard = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  margin-bottom: ${props => props.theme.spacing.lg}px;
  border: 1px solid ${props => props.theme.colors.border};
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const SettingItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border}20;

  &:last-child {
    border-bottom-width: 0;
  }
`;

const SettingInfo = styled.View`
  flex: 1;
`;

const SettingTitle = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const SettingDescription = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
`;

const CustomSwitch = styled.Switch`
  transform: scale(0.8);
`;

const InfoItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md}px ${props => props.theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border}20;

  &:last-child {
    border-bottom-width: 0;
  }
`;

const InfoLabel = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
`;

const InfoValue = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const BackupButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const CacheButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.warning};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const DangerButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const BackButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const ButtonText = styled.Text<{ color?: string }>`
  color: ${props => props.color || props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

export default SettingsScreen;