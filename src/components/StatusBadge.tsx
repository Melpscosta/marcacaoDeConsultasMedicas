import styled from 'styled-components/native';
import theme from '../styles/theme';
import type { AppointmentStatus } from '../types';

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: theme.colors.warning },
  confirmed: { label: 'Confirmado', color: theme.colors.success },
  cancelled: { label: 'Cancelado', color: theme.colors.error },
};

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color } = STATUS_CONFIG[status];
  return (
    <Badge color={color} accessibilityRole="text" accessibilityLabel={`Status: ${label}`}>
      <BadgeText color={color}>{label}</BadgeText>
    </Badge>
  );
}

const Badge = styled.View<{ color: string }>`
  background-color: ${(p: { color: string }) => p.color}20;
  padding: 4px 10px;
  border-radius: 12px;
`;

const BadgeText = styled.Text<{ color: string }>`
  font-size: ${theme.typography.small.fontSize}px;
  font-weight: 600;
  color: ${(p: { color: string }) => p.color};
`;
