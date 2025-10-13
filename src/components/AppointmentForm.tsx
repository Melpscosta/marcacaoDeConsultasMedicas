import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProfileImage } from '../services/profileImages';
import { authService } from '../services/auth';

const loadDoctors = async () => {
  try {
    const doctorsList = await authService.getAllDoctors();
    return doctorsList.map(doctor => ({
      ...doctor,
      image: doctor.image || getProfileImage(doctor.name, 'doctor')
    }));
  } catch (error) {
    console.error('Erro ao carregar médicos:', error);
    return [];
  }
};

type AppointmentFormProps = {
   onSubmit: (appointment: {
      doctorId: string;
      date: Date;
      time: string;
      description: string;
   }) => void;
};

const generateTimeSlots = () => {
   const slots = [];
   for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
   }
   return slots;
};

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
   const [selectedDoctor, setSelectedDoctor] = useState<string>('');
   const [dateInput, setDateInput] = useState('');
   const [selectedTime, setSelectedTime] = useState<string>('');
   const [description, setDescription] = useState('');
   const [doctors, setDoctors] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const timeSlots = generateTimeSlots();

   React.useEffect(() => {
      const fetchDoctors = async () => {
         const doctorsList = await loadDoctors();
         setDoctors(doctorsList);
         setLoading(false);
      };
      fetchDoctors();
   }, []);

   const validateDate = (inputDate: string) => {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = inputDate.match(dateRegex);

      if (!match) return false;

      const [, day, month, year] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

      return date >= today && date <= maxDate;
   };

   const handleDateChange = (text: string) => {
      const numbers = text.replace(/\D/g, '');

      let formattedDate = '';
      if (numbers.length > 0) {
         if (numbers.length <= 2) {
            formattedDate = numbers;
         } else if (numbers.length <= 4) {
            formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
         } else {
            formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
         }
      }

      setDateInput(formattedDate);
   };

   const handleSubmit = () => {
      if (!selectedDoctor || !selectedTime || !description) {
         Alert.alert('Erro', 'Por favor, preencha todos os campos');
         return;
      }

      if (!validateDate(dateInput)) {
         Alert.alert('Erro', 'Por favor, insira uma data válida (DD/MM/AAAA)');
         return;
      }

      const [day, month, year] = dateInput.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      onSubmit({
         doctorId: selectedDoctor,
         date,
         time: selectedTime,
         description,
      });
   };

   const isTimeSlotAvailable = (time: string) => {
      return true;
   };

   if (loading) {
      return (
         <LoadingContainer>
            <LoadingText>Carregando médicos...</LoadingText>
         </LoadingContainer>
      );
   }

   return (
      <Container>
         <SectionTitle>Selecione o Médico</SectionTitle>
         <DoctorList>
            {doctors.map((doctor) => (
               <DoctorCard
                  key={doctor.id}
                  selected={selectedDoctor === doctor.id}
                  onPress={() => setSelectedDoctor(doctor.id)}
               >
                  <DoctorImage source={{ uri: doctor.image }} />
                  <DoctorInfo>
                     <DoctorName>{doctor.name}</DoctorName>
                     <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
                  </DoctorInfo>
                  <SelectionIcon>
                     <Ionicons
                        name={selectedDoctor === doctor.id ? 'checkmark-circle' : 'ellipse-outline'}
                        size={20}
                        color={selectedDoctor === doctor.id ? '#00A878' : '#ccc'}
                     />
                  </SelectionIcon>
               </DoctorCard>
            ))}
         </DoctorList>

         <SectionTitle>Data e Hora</SectionTitle>
         <InputContainer>
            <InputLabel>Data da Consulta</InputLabel>
            <DateInput
               placeholder="DD/MM/AAAA"
               value={dateInput}
               onChangeText={handleDateChange}
               keyboardType="numeric"
               maxLength={10}
            />
            {dateInput && !validateDate(dateInput) && (
               <ErrorText>Data inválida</ErrorText>
            )}
         </InputContainer>

         <TimeSlotsContainer>
            <TimeSlotsTitle>Horários Disponíveis:</TimeSlotsTitle>
            <TimeSlotsGrid>
               {timeSlots.map((time) => {
                  const isAvailable = isTimeSlotAvailable(time);
                  return (
                     <TimeSlotButton
                        key={time}
                        selected={selectedTime === time}
                        disabled={!isAvailable}
                        onPress={() => isAvailable && setSelectedTime(time)}
                     >
                        <TimeSlotText selected={selectedTime === time} disabled={!isAvailable}>
                           {time}
                        </TimeSlotText>
                     </TimeSlotButton>
                  );
               })}
            </TimeSlotsGrid>
         </TimeSlotsContainer>

         <InputContainer>
            <InputLabel>Descrição da Consulta</InputLabel>
            <DescriptionInput
               placeholder="Descreva o motivo da consulta..."
               value={description}
               onChangeText={setDescription}
               multiline
               numberOfLines={4}
            />
         </InputContainer>

         <SubmitButton onPress={handleSubmit}>
            <Ionicons name="calendar-check" size={20} color="#fff" />
            <SubmitButtonText>Agendar Consulta</SubmitButtonText>
         </SubmitButton>
      </Container>
   );
};

// Componentes estilizados
const Container = styled.View`
  padding: ${props => props.theme.spacing.lg}px;
`;

const LoadingContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

const LoadingText = styled.Text`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.body.fontSize}px;
`;

const SectionTitle = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const DoctorList = styled.ScrollView`
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const DoctorCard = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.lg}px;
  background-color: ${props => props.selected
    ? props.theme.colors.primaryLight
    : props.theme.colors.surface
  };
  border-radius: ${props => props.theme.borderRadius.lg}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  border: 2px solid ${props => props.selected
    ? props.theme.colors.primary
    : props.theme.colors.border
  };
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${props => props.theme.spacing.md}px;
  border: 2px solid ${props => props.theme.colors.border};
`;

const DoctorInfo = styled.View`
  flex: 1;
`;

const DoctorName = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const DoctorSpecialty = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
`;

const SelectionIcon = styled.View`
  align-items: center;
  justify-content: center;
`;

const InputContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const InputLabel = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const DateInput = styled.TextInput`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  border: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
`;

const ErrorText = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.xs}px;
`;

const TimeSlotsContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const TimeSlotsTitle = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const TimeSlotsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm}px;
`;

const TimeSlotButton = styled.TouchableOpacity<{ selected: boolean; disabled: boolean }>`
  background-color: ${props => {
    if (props.disabled) return props.theme.colors.background;
    if (props.selected) return props.theme.colors.primary;
    return props.theme.colors.surface;
  }};
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  border: 1px solid ${props => {
    if (props.disabled) return props.theme.colors.border;
    if (props.selected) return props.theme.colors.primary;
    return props.theme.colors.border;
  }};
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const TimeSlotText = styled.Text<{ selected: boolean; disabled: boolean }>`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  color: ${props => {
    if (props.disabled) return props.theme.colors.textMuted;
    if (props.selected) return props.theme.colors.white;
    return props.theme.colors.text;
  }};
`;

const DescriptionInput = styled.TextInput`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  border: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
  text-align-vertical: top;
`;

const SubmitButton = styled.TouchableOpacity`
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

const SubmitButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

export default AppointmentForm; 