import React from 'react';
import styled from 'styled-components/native';
import theme from '../styles/theme';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

interface CalendarPickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  availableDates?: string[];
}

function dateToStr(d: Date): string {
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function getDaysInMonth(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days: (number | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

export default function CalendarPicker({ selectedDate, onSelectDate, minDate = new Date(), availableDates }: CalendarPickerProps) {
  const [viewDate, setViewDate] = React.useState(selectedDate || new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getDaysInMonth(year, month);

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  const isDisabled = (day: number | null) => {
    if (!day) return true;
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    if (d < min) return true;
    if (availableDates && availableDates.length > 0) {
      const str = dateToStr(d);
      return !availableDates.includes(str);
    }
    return false;
  };

  const handleSelect = (day: number | null) => {
    if (!day || isDisabled(day)) return;
    const d = new Date(year, month, day);
    onSelectDate(d);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1));

  return (
    <Container>
      <MonthNav>
        <NavButton onPress={prevMonth} accessibilityRole="button" accessibilityLabel="Mês anterior">
          <NavText>‹</NavText>
        </NavButton>
        <MonthTitle>{MONTHS[month]} {year}</MonthTitle>
        <NavButton onPress={nextMonth} accessibilityRole="button" accessibilityLabel="Próximo mês">
          <NavText>›</NavText>
        </NavButton>
      </MonthNav>

      <WeekdayRow>
        {WEEKDAYS.map((w) => (
          <WeekdayCell key={w}>{w}</WeekdayCell>
        ))}
      </WeekdayRow>

      <DaysGrid>
        {days.map((day, i) => (
          <DayCell
            key={i}
            onPress={() => handleSelect(day)}
            selected={!!day && isSelected(day)}
            disabled={!!day && isDisabled(day)}
            empty={!day}
          >
            <DayText selected={!!day && isSelected(day)} disabled={!!day && isDisabled(day)}>
              {day || ''}
            </DayText>
          </DayCell>
        ))}
      </DaysGrid>
    </Container>
  );
}

const Container = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: ${theme.spacing.medium || theme.spacing.md}px;
  margin-bottom: ${theme.spacing.medium || theme.spacing.md}px;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  elevation: 3;
`;

const MonthNav = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.medium || theme.spacing.md}px;
`;

const NavButton = styled.TouchableOpacity`
  padding: ${theme.spacing.small || theme.spacing.sm}px;
`;

const NavText = styled.Text`
  font-size: 24px;
  color: ${theme.colors.primary};
  font-weight: bold;
`;

const MonthTitle = styled.Text`
  font-size: ${theme.typography.subtitle?.fontSize || 18}px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const WeekdayRow = styled.View`
  flex-direction: row;
  margin-bottom: ${theme.spacing.small || theme.spacing.sm}px;
`;

const WeekdayCell = styled.Text`
  flex: 1;
  text-align: center;
  font-size: ${theme.typography.small?.fontSize || 12}px;
  color: ${theme.colors.textMuted};
`;

const DaysGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const DayCell = styled.TouchableOpacity<{ selected?: boolean; disabled?: boolean; empty?: boolean }>`
  width: 14.28%;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: ${(p: { selected?: boolean }) => (p.selected ? theme.colors.primary : 'transparent')};
  opacity: ${(p: { disabled?: boolean }) => (p.disabled ? 0.4 : 1)};
`;

const DayText = styled.Text<{ selected?: boolean; disabled?: boolean }>`
  font-size: ${theme.typography.body?.fontSize || 16}px;
  color: ${(p: { selected?: boolean; disabled?: boolean }) => (p.selected ? theme.colors.white : p.disabled ? theme.colors.textMuted : theme.colors.text)};
  font-weight: ${(p: { selected?: boolean }) => (p.selected ? '600' : '400')};
`;
