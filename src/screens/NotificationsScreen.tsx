import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { notificationService, Notification } from '../services/notifications';

type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Notifications'>;
};

const NotificationsScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NotificationsScreenProps['navigation']>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      const userNotifications = await notificationService.getNotifications(user.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
    }, [user?.id])
  );

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      loadNotifications();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Excluir Notificação',
      'Tem certeza que deseja excluir esta notificação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationService.deleteNotification(notificationId);
              loadNotifications();
            } catch (error) {
              console.error('Erro ao excluir notificação:', error);
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed':
        return '✅';
      case 'appointment_cancelled':
        return '❌';
      case 'appointment_reminder':
        return '⏰';
      default:
        return '📩';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container>
      <Header>
        <HeaderTitle>Notificações</HeaderTitle>
        <HeaderSubtitle>Gerencie suas notificações</HeaderSubtitle>
      </Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TitleContainer>
          <Title>Notificações</Title>
          {unreadCount > 0 && (
            <UnreadBadge>
              <UnreadCount>{unreadCount}</UnreadCount>
            </UnreadBadge>
          )}
        </TitleContainer>

        {unreadCount > 0 && (
          <MarkAllButton onPress={handleMarkAllAsRead}>
            <Ionicons name="checkmark-done" size={20} color="#fff" />
            <ButtonText>Marcar todas como lidas</ButtonText>
          </MarkAllButton>
        )}

        {loading ? (
          <LoadingContainer>
            <Ionicons name="notifications-outline" size={48} color={props => props.theme.colors.textMuted} />
            <LoadingText>Carregando notificações...</LoadingText>
          </LoadingContainer>
        ) : notifications.length === 0 ? (
          <EmptyContainer>
            <Ionicons name="notifications-off-outline" size={64} color={props => props.theme.colors.textMuted} />
            <EmptyText>Nenhuma notificação encontrada</EmptyText>
          </EmptyContainer>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              isRead={notification.read}
              onPress={() => !notification.read && handleMarkAsRead(notification.id)}
              onLongPress={() => handleDeleteNotification(notification.id)}
            >
              <NotificationContent>
                <NotificationHeader>
                  <NotificationIcon>{getNotificationIcon(notification.type)}</NotificationIcon>
                  <NotificationInfo>
                    <NotificationTitle>{notification.title}</NotificationTitle>
                    {!notification.read && <UnreadDot />}
                  </NotificationInfo>
                </NotificationHeader>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <DateText>{formatDate(notification.createdAt)}</DateText>
              </NotificationContent>
            </NotificationCard>
          ))
        )}

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

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const Title = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
`;

const UnreadBadge = styled.View`
  background-color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  min-width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const UnreadCount = styled.Text`
  color: #fff;
  font-size: ${props => props.theme.typography.small.fontSize}px;
  font-weight: 600;
`;

const MarkAllButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg}px;
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

const NotificationCard = styled.TouchableOpacity<{ isRead: boolean }>`
  background-color: ${props => props.isRead
    ? props.theme.colors.surface
    : props.theme.colors.primaryLight
  };
  border-radius: ${props => props.theme.borderRadius.lg}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  border: 1px solid ${props => props.isRead
    ? props.theme.colors.border
    : props.theme.colors.primary + '30'
  };
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const NotificationContent = styled.View`
  padding: ${props => props.theme.spacing.lg}px;
`;

const NotificationHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const NotificationIcon = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const NotificationInfo = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const NotificationTitle = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.error};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const NotificationMessage = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
  line-height: 22px;
`;

const DateText = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
`;

const BackButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

export default NotificationsScreen;