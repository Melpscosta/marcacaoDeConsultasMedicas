import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreateAppointmentButtonProps {
  onPress: () => void;
}

export const CreateAppointmentButton: React.FC<CreateAppointmentButtonProps> = ({ onPress }) => {
  return (
    <ButtonContainer onPress={onPress}>
      <ButtonContent>
        <IconContainer>
          <Ionicons name="add-circle-outline" size={24} color="white" />
        </IconContainer>
        <ButtonText>Agendar Nova Consulta</ButtonText>
      </ButtonContent>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  margin-bottom: ${props => props.theme.spacing.lg}px;
  shadow-color: ${props => props.theme.colors.primary};
  shadow-offset: { width: 0, height: 2 };
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 4;
`;

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: ${props => props.theme.spacing.md}px;
  padding-horizontal: ${props => props.theme.spacing.lg}px;
`;

const IconContainer = styled.View`
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
`;