import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, ScrollView } from 'react-native';

interface TimeSlotPickerProps {
  availableSlots: string[];
  selectedSlot?: string;
  onSlotSelect: (slot: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  availableSlots,
  selectedSlot,
  onSlotSelect,
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  return (
    <TimeSlotContainer>
      <TimeSlotTitle>Horários Disponíveis</TimeSlotTitle>
      <TimeSlotList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {availableSlots.map((slot) => (
          <TimeSlot
            key={slot}
            isSelected={selectedSlot === slot}
            onPress={() => onSlotSelect(slot)}
          >
            <TimeSlotText isSelected={selectedSlot === slot}>
              {formatTime(slot)}
            </TimeSlotText>
          </TimeSlot>
        ))}
      </TimeSlotList>
    </TimeSlotContainer>
  );
};

const TimeSlotContainer = styled.View`
  margin-vertical: ${props => props.theme.spacing.md}px;
`;

const TimeSlotTitle = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const TimeSlotList = styled.ScrollView`
  flex-direction: row;
`;

const TimeSlot = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${props =>
    props.isSelected
      ? props.theme.colors.primary
      : props.theme.colors.background
  };
  border: 1px solid ${props =>
    props.isSelected
      ? props.theme.colors.primary
      : props.theme.colors.border
  };
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  padding-vertical: ${props => props.theme.spacing.sm}px;
  margin-horizontal: ${props => props.theme.spacing.xs}px;
  margin-vertical: ${props => props.theme.spacing.xs}px;
  min-width: 80px;
  align-items: center;
`;

const TimeSlotText = styled.Text<{ isSelected: boolean }>`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  color: ${props =>
    props.isSelected
      ? props.theme.colors.white
      : props.theme.colors.text
  };
`;