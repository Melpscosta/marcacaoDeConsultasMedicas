import React from 'react';
import styled from 'styled-components/native';
import { View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface DoctorListProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
  selectedDoctorId?: string;
  style?: any;
}

const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onSelectDoctor,
  selectedDoctorId,
  style,
}) => {
  return (
    <Container style={style}>
      {doctors.map((doctor) => (
        <DoctorItem
          key={doctor.id}
          onPress={() => onSelectDoctor(doctor)}
          selected={selectedDoctorId === doctor.id}
        >
          <DoctorAvatar
            source={{ uri: doctor.image }}
          />
          <DoctorInfo>
            <DoctorName>{doctor.name}</DoctorName>
            <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
          </DoctorInfo>
          <SelectionIcon>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={props => props.theme.colors.textMuted}
            />
          </SelectionIcon>
        </DoctorItem>
      ))}
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const DoctorItem = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.selected
    ? props.theme.colors.primaryLight
    : props.theme.colors.surface
  };
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-vertical: ${props => props.theme.spacing.xs}px;
  border: 1px solid ${props => props.selected
    ? props.theme.colors.primary
    : props.theme.colors.border
  };
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const DoctorAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
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

export default DoctorList; 