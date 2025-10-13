// src/screens/HomeScreen/index.tsx
import React from 'react';
import { RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Appointment } from '../../types/appointments';
import { useHomeScreen } from './hooks/useHomeScreen';
import { AppointmentItem } from './components/AppointmentItem';
import { CreateAppointmentButton } from './components/CreateAppointmentButton';
import {
  Container,
  HeaderContainer,
  HeaderTitle,
  HeaderSubtitle,
  Content,
  AppointmentList,
  EmptyContainer,
  EmptyIcon,
  EmptyText,
  EmptySubtext,
} from './styles';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    appointments,
    refreshing,
    onRefresh,
    handleDeleteAppointment,
    handleEditAppointment,
  } = useHomeScreen();

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <AppointmentItem
      appointment={item}
      onEdit={handleEditAppointment}
      onDelete={handleDeleteAppointment}
    />
  );

  const handleCreateAppointment = () => {
    navigation.navigate('CreateAppointment');
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getPendingAppointmentsCount = () => {
    return appointments.filter(apt => apt.status === 'pending').length;
  };

  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>{getWelcomeMessage()}!</HeaderTitle>
        <HeaderSubtitle>
          {appointments.length > 0
            ? `Você tem ${appointments.length} consulta${appointments.length > 1 ? 's' : ''} agendada${appointments.length > 1 ? 's' : ''}`
            : 'Nenhuma consulta agendada'
          }
          {getPendingAppointmentsCount() > 0 && (
            ` (${getPendingAppointmentsCount()} pendente${getPendingAppointmentsCount() > 1 ? 's' : ''})`
          )}
        </HeaderSubtitle>
      </HeaderContainer>

      <Content>
        <CreateAppointmentButton onPress={handleCreateAppointment} />

        <AppointmentList
          data={appointments}
          keyExtractor={(item: Appointment) => item.id}
          renderItem={renderAppointment}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0066CC']}
              tintColor="#0066CC"
            />
          }
          ListEmptyComponent={
            <EmptyContainer>
              <EmptyIcon>
                <Ionicons name="calendar-outline" size={40} color="#0066CC" />
              </EmptyIcon>
              <EmptyText>Nenhuma consulta agendada</EmptyText>
              <EmptySubtext>
                Toque no botão acima para agendar sua primeira consulta
              </EmptySubtext>
            </EmptyContainer>
          }
          showsVerticalScrollIndicator={false}
        />
      </Content>
    </Container>
  );
};

export default HomeScreen;