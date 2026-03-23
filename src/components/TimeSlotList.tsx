import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import theme from '../styles/theme';
import { TIME_SLOTS } from '../types';

interface TimeSlotListProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  slots?: string[];
}

export default function TimeSlotList({ selectedTime, onSelectTime, slots }: TimeSlotListProps) {
  const displaySlots = slots && slots.length > 0 ? slots : TIME_SLOTS;
  return (
    <Container>
      <SectionTitle>Horários disponíveis</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <SlotsRow>
          {displaySlots.map((time) => (
            <SlotButton
              key={time}
              onPress={() => onSelectTime(time)}
              selected={selectedTime === time}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedTime === time }}
              accessibilityLabel={`Horário ${time}`}
            >
              <SlotText selected={selectedTime === time}>{time}</SlotText>
            </SlotButton>
          ))}
        </SlotsRow>
      </ScrollView>
    </Container>
  );
}

const Container = styled.View`
  margin-bottom: ${theme.spacing.medium}px;
`;

const SectionTitle = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small}px;
`;

const SlotsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-right: ${theme.spacing.medium}px;
`;

const SlotButton = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 12px 20px;
  margin-right: ${theme.spacing.small}px;
  margin-bottom: ${theme.spacing.small}px;
  border-radius: 8px;
  background-color: ${(p: { selected?: boolean }) => (p.selected ? theme.colors.primary : theme.colors.white)};
  border: 2px solid ${(p: { selected?: boolean }) => (p.selected ? theme.colors.primary : '#E2E8F0')};
`;

const SlotText = styled.Text<{ selected?: boolean }>`
  font-size: ${theme.typography.body.fontSize}px;
  font-weight: 600;
  color: ${(p: { selected?: boolean }) => (p.selected ? theme.colors.white : theme.colors.text)};
`;
