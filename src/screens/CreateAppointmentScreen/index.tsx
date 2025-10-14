import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import DoctorList from '../../components/DoctorList';
import TimeSlotList from '../../components/TimeSlotList';
import CalendarPicker from '../../components/CalendarPicker';
import { availableDoctors, Doctor } from './models/doctors';
import { createAppointment } from './services/createAppointmentService';
import { authService } from '../../services/auth';
import {
  Container,
  Header,
  HeaderTitle,
  HeaderSubtitle,
  FormCard,
  InputContainer,
  InputLabel,
  InputLabelText,
  DateInput,
  SectionTitle,
  LoadingContainer,
  LoadingText,
  ButtonsContainer,
  PrimaryButton,
  ButtonText,
  SecondaryButton,
  SecondaryButtonText,
  ErrorText,
  styles
} from './styles';

type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

const CreateAppointmentScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  React.useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsList = await authService.getAllDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        // Usa os médicos mockados como fallback
        setDoctors(availableDoctors);
      } finally {
        setDoctorsLoading(false);
      }
    };
    loadDoctors();
  }, []);

  React.useEffect(() => {
    // Atualiza o campo de texto quando a data é selecionada no calendário
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    setDate(`${day}/${month}/${year}`);
  }, [selectedDate]);

  const validateDate = (inputDate: string) => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = inputDate.match(dateRegex);

    if (!match) return false;

    const [, day, month, year] = match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date >= today;
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

    setDate(formattedDate);
  };

  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha todos os campos');
        return;
      }

      if (!validateDate(date)) {
        setError('Por favor, insira uma data válida (DD/MM/AAAA)');
        return;
      }

      await createAppointment(date, selectedTime, selectedDoctor!, user!);

      Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Agendar Consulta</HeaderTitle>
        <HeaderSubtitle>Marque sua consulta com um de nossos especialistas</HeaderSubtitle>
      </Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormCard>
          <InputContainer>
            <InputLabel>
              <Ionicons name="calendar" size={16} color="#0066CC" />
              <InputLabelText>Data da Consulta</InputLabelText>
            </InputLabel>
            <CalendarPicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              minDate={new Date()}
            />
            <DateInput
              placeholder="DD/MM/AAAA"
              value={date}
              onChangeText={handleDateChange}
              keyboardType="numeric"
              maxLength={10}
              editable={false} // Torna o campo apenas leitura
            />
            {date && !validateDate(date) && (
              <ErrorText>Data inválida. A data deve ser hoje ou uma data futura.</ErrorText>
            )}
          </InputContainer>
        </FormCard>

        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        <SectionTitle>Selecione um Médico</SectionTitle>
        {doctorsLoading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#0066CC" />
            <LoadingText>Carregando médicos...</LoadingText>
          </LoadingContainer>
        ) : (
          <DoctorList
            doctors={doctors}
            onSelectDoctor={setSelectedDoctor}
            selectedDoctorId={selectedDoctor?.id}
          />
        )}

        {error ? <ErrorText>{error}</ErrorText> : null}

        <ButtonsContainer>
          <PrimaryButton onPress={handleCreateAppointment} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <ButtonText>Agendar Consulta</ButtonText>
              </>
            )}
          </PrimaryButton>

          <SecondaryButton onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={20} color="#0066CC" />
            <SecondaryButtonText>Cancelar</SecondaryButtonText>
          </SecondaryButton>
        </ButtonsContainer>
      </ScrollView>
    </Container>
  );
};

export default CreateAppointmentScreen;