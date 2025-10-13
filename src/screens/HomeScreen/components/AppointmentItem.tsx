// src/screens/HomeScreen/components/AppointmentItem.tsx
import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '../../../types/appointments';
import { getDoctorInfo } from '../models/doctors';
import {
  AppointmentCard,
  DoctorInfoContainer,
  DoctorImage,
  DoctorInfo,
  DoctorName,
  DoctorSpecialty,
  AppointmentDetails,
  DetailRow,
  DetailRowLast,
  DetailIcon,
  DetailText,
  DetailLabel,
  StatusContainer,
  StatusBadge,
  StatusText,
  ActionButtons,
  LeftActions,
  RightActions,
  ActionButton,
  EditButton,
  DeleteButton,
} from '../styles';

interface AppointmentItemProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
}

export const AppointmentItem: React.FC<AppointmentItemProps> = ({
  appointment,
  onEdit,
  onDelete,
}) => {
  const doctor = getDoctorInfo(appointment.doctorId);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(appointment);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Cancelar Consulta',
      'Tem certeza que deseja cancelar esta consulta?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(appointment.id);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <AppointmentCard>
      {/* Informações do Médico */}
      <DoctorInfoContainer>
        <DoctorImage source={{ uri: doctor?.image || 'https://via.placeholder.com/100' }} />
        <DoctorInfo>
          <DoctorName>{doctor?.name || 'Médico não encontrado'}</DoctorName>
          <DoctorSpecialty>{doctor?.specialty || 'Especialidade não encontrada'}</DoctorSpecialty>
        </DoctorInfo>
      </DoctorInfoContainer>

      {/* Detalhes da Consulta */}
      <AppointmentDetails>
        <DetailRow>
          <DetailIcon>
            <Ionicons name="calendar-outline" size={18} color="#666" />
          </DetailIcon>
          <DetailText>
            <DetailLabel>Data</DetailLabel>
            {formatDate(appointment.date)}
          </DetailText>
        </DetailRow>

        <DetailRow>
          <DetailIcon>
            <Ionicons name="time-outline" size={18} color="#666" />
          </DetailIcon>
          <DetailText>
            <DetailLabel>Horário</DetailLabel>
            {appointment.time}
          </DetailText>
        </DetailRow>

        {appointment.description && (
          <DetailRowLast>
            <DetailIcon>
              <Ionicons name="clipboard-outline" size={18} color="#666" />
            </DetailIcon>
            <DetailText>
              <DetailLabel>Descrição</DetailLabel>
              {appointment.description}
            </DetailText>
          </DetailRowLast>
        )}
      </AppointmentDetails>

      {/* Status da Consulta */}
      <StatusContainer>
        <StatusBadge status={appointment.status}>
          <StatusText status={appointment.status}>
            {getStatusText(appointment.status)}
          </StatusText>
        </StatusBadge>
      </StatusContainer>

      {/* Botões de Ação */}
      <ActionButtons>
        <LeftActions>
          <TouchableOpacity onPress={() => {}}>
            <DetailText style={{ fontSize: 12, color: '#666' }}>
              Toque para ver detalhes
            </DetailText>
          </TouchableOpacity>
        </LeftActions>

        <RightActions>
          <EditButton onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color="#0066CC" />
          </EditButton>

          <DeleteButton onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#E53E3E" />
          </DeleteButton>
        </RightActions>
      </ActionButtons>
    </AppointmentCard>
  );
};