import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CalendarPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return formatDate(date1).getTime() === formatDate(date2).getTime();
  };

  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formattedDate = formatDate(date);

    if (minDate && formattedDate < formatDate(minDate)) {
      return false;
    }

    if (maxDate && formattedDate > formatDate(maxDate)) {
      return false;
    }

    return formattedDate >= today;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateSelectable(newDate)) {
      onDateChange(newDate);
    }
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return daysOfWeek.map((day, index) => (
      <DayOfWeek key={index}>
        <DayOfWeekText>{day}</DayOfWeekText>
      </DayOfWeek>
    ));
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Adicionar espaços vazios para os dias antes do primeiro dia do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<EmptyDay key={`empty-${i}`} />);
    }

    // Adicionar os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = isSameDay(currentDate, selectedDate);
      const isSelectable = isDateSelectable(currentDate);
      const isToday = isSameDay(currentDate, new Date());

      days.push(
        <Day
          key={day}
          onPress={() => handleDateSelect(day)}
          disabled={!isSelectable}
          isSelected={isSelected}
          isToday={isToday}
        >
          <DayText
            isSelected={isSelected}
            isToday={isToday}
            disabled={!isSelectable}
          >
            {day}
          </DayText>
        </Day>
      );
    }

    return days;
  };

  const monthYearString = currentMonth.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavigationButton onPress={handlePreviousMonth}>
          <Ionicons name="chevron-back" size={24} color="#0066CC" />
        </MonthNavigationButton>

        <MonthYearText>{monthYearString.charAt(0).toUpperCase() + monthYearString.slice(1)}</MonthYearText>

        <MonthNavigationButton onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="#0066CC" />
        </MonthNavigationButton>
      </CalendarHeader>

      <DaysOfWeekContainer>
        {renderDaysOfWeek()}
      </DaysOfWeekContainer>

      <DaysContainer>
        {renderDays()}
      </DaysContainer>
    </CalendarContainer>
  );
};

const CalendarContainer = styled.View`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: { width: 0, height: 2 };
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 4;
  border: 1px solid ${props => props.theme.colors.border};
`;

const CalendarHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const MonthNavigationButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.sm}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
`;

const MonthYearText = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  text-transform: capitalize;
`;

const DaysOfWeekContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const DayOfWeek = styled.View`
  flex: 1;
  align-items: center;
  padding-vertical: ${props => props.theme.spacing.sm}px;
`;

const DayOfWeekText = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  font-weight: 600;
  color: ${props => props.theme.colors.textMuted};
  text-transform: uppercase;
`;

const DaysContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const EmptyDay = styled.View`
  width: 14.28%;
  height: 40px;
`;

const Day = styled.TouchableOpacity<{
  isSelected: boolean;
  isToday: boolean;
  disabled: boolean;
}>`
  width: 14.28%;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: ${props => props.theme.borderRadius.md}px;
  background-color: ${props => {
    if (props.isSelected) return props.theme.colors.primary;
    if (props.isToday) return props.theme.colors.primaryLight;
    return 'transparent';
  }};
  opacity: ${props => (props.disabled ? 0.3 : 1)};
`;

const DayText = styled.Text<{
  isSelected: boolean;
  isToday: boolean;
  disabled: boolean;
}>`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => {
    if (props.isSelected) return '600';
    if (props.isToday) return '500';
    return '400';
  }};
  color: ${props => {
    if (props.isSelected) return props.theme.colors.white;
    if (props.isToday) return props.theme.colors.primary;
    if (props.disabled) return props.theme.colors.textMuted;
    return props.theme.colors.text;
  }};
`;

export default CalendarPicker;