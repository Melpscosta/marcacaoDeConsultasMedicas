// src/screens/HomeScreen/styles.ts
import styled from 'styled-components/native';
import { FlatList, TouchableOpacity, View } from 'react-native';
import theme from '../../styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

export const HeaderContainer = styled.View`
  background-color: ${props => props.theme.colors.primary};
  padding-horizontal: ${props => props.theme.spacing.lg}px;
  padding-vertical: ${props => props.theme.spacing.lg}px;
  padding-top: ${props => props.theme.spacing.xl}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: { width: 0, height: 2 };
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 4;
`;

export const HeaderTitle = styled.Text`
  font-size: ${props => props.theme.typography.heading.fontSize}px;
  font-weight: ${props => props.theme.typography.heading.fontWeight};
  color: ${props => props.theme.colors.white};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

export const HeaderSubtitle = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.white};
  opacity: 0.9;
  text-align: center;
`;

export const Content = styled.View`
  flex: 1;
  padding: ${props => props.theme.spacing.lg}px;
`;

export const AppointmentList = styled(FlatList)`
  flex: 1;
`;

export const AppointmentCard = styled.View`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
`;

export const DoctorInfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

export const DoctorImage = styled.Image`
  width: ${props => props.theme.sizes.avatar.lg}px;
  height: ${props => props.theme.sizes.avatar.lg}px;
  border-radius: ${props => props.theme.sizes.avatar.lg / 2}px;
  margin-right: ${props => props.theme.spacing.md}px;
  border: 2px solid ${props => props.theme.colors.border};
`;

export const DoctorInfo = styled.View`
  flex: 1;
`;

export const DoctorName = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

export const DoctorSpecialty = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

export const AppointmentDetails = styled.View`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

export const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

export const DetailRowLast = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DetailIcon = styled.View`
  margin-right: ${props => props.theme.spacing.sm}px;
`;

export const DetailText = styled.Text`
  flex: 1;
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
`;

export const DetailLabel = styled.Text`
  font-size: ${props => props.theme.typography.caption.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
  margin-bottom: 2px;
`;

export const StatusContainer = styled.View`
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

export const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const LeftActions = styled.View`
  flex-direction: row;
`;

export const RightActions = styled.View`
  flex-direction: row;
`;

export const ActionButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.sm}px;
  margin-right: ${props => props.theme.spacing.sm}px;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
`;

export const DeleteButton = styled(ActionButton)`
  background-color: ${props => props.theme.colors.error}15;
`;

export const EditButton = styled(ActionButton)`
  background-color: ${props => props.theme.colors.primary}15;
`;

export const StatusBadge = styled.View<{ status: string }>`
  background-color: ${props => {
    switch (props.status) {
      case 'confirmed':
        return props.theme.colors.appointmentConfirmed + '20';
      case 'pending':
        return props.theme.colors.appointmentPending + '20';
      case 'cancelled':
        return props.theme.colors.appointmentCancelled + '20';
      default:
        return props.theme.colors.textMuted + '20';
    }
  }};
  border-radius: ${props => props.theme.borderRadius.sm}px;
  padding-horizontal: ${props => props.theme.spacing.sm}px;
  padding-vertical: ${props => props.theme.spacing.xs}px;
  align-self: flex-start;
`;

export const StatusText = styled.Text<{ status: string }>`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  font-weight: 600;
  color: ${props => {
    switch (props.status) {
      case 'confirmed':
        return props.theme.colors.appointmentConfirmed;
      case 'pending':
        return props.theme.colors.appointmentPending;
      case 'cancelled':
        return props.theme.colors.appointmentCancelled;
      default:
        return props.theme.colors.textMuted;
    }
  }};
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

export const EmptyIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.xl}px;
  background-color: ${props => props.theme.colors.primaryLight};
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

export const EmptyText = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

export const EmptySubtext = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
  text-align: center;
  line-height: 22px;
`;