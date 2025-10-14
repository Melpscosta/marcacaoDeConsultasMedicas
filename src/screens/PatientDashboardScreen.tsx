import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBadge } from '../components/FeedbackMessages';
import theme from '../styles/theme';

type PatientDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientDashboard'>;
};

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface StyledProps {
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    default:
      return theme.colors.warning;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Pendente';
  }
};

const PatientDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<PatientDashboardScreenProps['navigation']>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        const userAppointments = allAppointments.filter(
          (appointment) => appointment.patientId === user?.id
        );
        setAppointments(userAppointments);
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega as consultas quando a tela estiver em foco
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <AppointmentCard>
      <AppointmentHeader>
        <DoctorInfo>
          <DoctorName>{item.doctorName}</DoctorName>
          <SpecialtyTag>
            <Ionicons name="medical" size={14} color={theme.colors.primary} />
            <SpecialtyText>{item.specialty}</SpecialtyText>
          </SpecialtyTag>
        </DoctorInfo>
        <StatusBadge status={item.status} />
      </AppointmentHeader>

      <AppointmentDetails>
        <DetailRow>
          <Ionicons name="calendar" size={16} color={theme.colors.textMuted} />
          <DetailText>{item.date}</DetailText>
        </DetailRow>
        <DetailRow>
          <Ionicons name="clock" size={16} color={theme.colors.textMuted} />
          <DetailText>{item.time}</DetailText>
        </DetailRow>
      </AppointmentDetails>
    </AppointmentCard>
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>Minhas Consultas</HeaderTitle>
        <HeaderSubtitle>Bem-vindo(a), {user?.name}</HeaderSubtitle>
      </Header>

      <Content>
        <ActionsContainer>
          <PrimaryButton onPress={() => navigation.navigate('CreateAppointment')}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <ButtonText>Agendar Consulta</ButtonText>
          </PrimaryButton>
        </ActionsContainer>

        <SecondaryActionsContainer>
          <SecondaryButton onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={20} color={theme.colors.primary} />
            <SecondaryButtonText>Meu Perfil</SecondaryButtonText>
          </SecondaryButton>

          <SecondaryButton onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={20} color={theme.colors.primary} />
            <SecondaryButtonText>Configurações</SecondaryButtonText>
          </SecondaryButton>
        </SecondaryActionsContainer>

        <SectionTitle>Minhas Consultas</SectionTitle>
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <LoadingText>Carregando consultas...</LoadingText>
          </LoadingContainer>
        ) : appointments.length === 0 ? (
          <EmptyContainer>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textMuted} />
            <EmptyText>Nenhuma consulta agendada</EmptyText>
            <EmptySubtext>Toque em "Agendar Consulta" para marcar sua primeira consulta</EmptySubtext>
          </EmptyContainer>
        ) : (
          <AppointmentList
            data={appointments}
            renderItem={renderAppointmentItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}

        <LogoutButton onPress={signOut}>
          <Ionicons name="log-out" size={24} color="#fff" />
          <LogoutText>Sair</LogoutText>
        </LogoutButton>
      </Content>
    </Container>
  );
};

// Componentes estilizados
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

const Content = styled.View`
  flex: 1;
  padding: ${props => props.theme.spacing.lg}px;
`;

const ActionsContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const SecondaryActionsContainer = styled.View`
  flex-direction: row;
  gap: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const SecondaryButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SecondaryButtonText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const SectionTitle = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg}px;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const LoadingContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

const LoadingText = styled.Text`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

const EmptyText = styled.Text`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  margin-top: ${props => props.theme.spacing.md}px;
  text-align: center;
`;

const EmptySubtext = styled.Text`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  margin-top: ${props => props.theme.spacing.sm}px;
  text-align: center;
  line-height: 22px;
`;

const AppointmentList = styled.FlatList`
  flex: 1;
`;

const AppointmentCard = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  border: 1px solid ${props => props.theme.colors.border};
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const AppointmentHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const DoctorInfo = styled.View`
  flex: 1;
`;

const DoctorName = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const SpecialtyTag = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.primaryLight};
  padding: ${props => props.theme.spacing.xs}px ${props => props.theme.spacing.sm}px;
  border-radius: ${props => props.theme.borderRadius.sm}px;
  align-self: flex-start;
`;

const SpecialtyText = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const AppointmentDetails = styled.View`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailText = styled.Text`
  flex: 1;
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.xl}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const LogoutText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

export default PatientDashboardScreen; 