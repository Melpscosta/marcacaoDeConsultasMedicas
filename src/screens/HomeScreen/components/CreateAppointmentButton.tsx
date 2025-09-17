import React from 'react';
import { Button } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import theme from '../../../styles/theme';

interface CreateAppointmentButtonProps {
  onPress: () => void;
}

export const CreateAppointmentButton: React.FC<CreateAppointmentButtonProps> = ({ onPress }) => {
  return (
    <Button
      title="Agendar Nova Consulta"
      icon={
        <FontAwesome
          name="calendar-plus-o"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
      }
      buttonStyle={{
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
        padding: 12,
        marginBottom: theme.spacing.medium
      }}
      onPress={onPress}
    />
  );
};