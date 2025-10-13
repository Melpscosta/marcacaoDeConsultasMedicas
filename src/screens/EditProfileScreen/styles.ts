import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';

export const styles = {
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
};

// Componentes estilizados com layout correto
export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

export const Header = styled.View`
  background-color: ${props => props.theme.colors.primary};
  padding-horizontal: ${props => props.theme.spacing.lg}px;
  padding-vertical: ${props => props.theme.spacing.lg}px;
  padding-top: ${props => props.theme.spacing.xl}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
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

export const ProfileCard = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  margin-bottom: ${props => props.theme.spacing.lg}px;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.border};
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const ProfileImageContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

export const RoleBadge = styled.View<{ role: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${props => {
    switch (props.role) {
      case 'admin':
        return props.theme.colors.primary;
      case 'doctor':
        return props.theme.colors.success;
      default:
        return props.theme.colors.secondary;
    }
  }};
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.borderRadius.lg}px;
  margin-top: ${props => props.theme.spacing.md}px;
`;

export const RoleText = styled.Text`
  color: #fff;
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

export const FormCard = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  margin-bottom: ${props => props.theme.spacing.lg}px;
  border: 1px solid ${props => props.theme.colors.border};
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const InputContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.lg}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InputLabel = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

export const InputLabelText = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

export const StyledInput = styled.TextInput`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
`;

export const ButtonsContainer = styled.View`
  gap: ${props => props.theme.spacing.md}px;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const SaveButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

export const CancelButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const CancelButtonText = styled.Text`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;