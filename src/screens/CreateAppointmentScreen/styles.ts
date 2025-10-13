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

export const DateInput = styled.TextInput`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
`;

export const SectionTitle = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

export const LoadingContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

export const LoadingText = styled.Text`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  margin-top: ${props => props.theme.spacing.md}px;
`;

export const ButtonsContainer = styled.View`
  gap: ${props => props.theme.spacing.md}px;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

export const PrimaryButton = styled.TouchableOpacity`
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

export const ButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

export const SecondaryButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const SecondaryButtonText = styled.Text`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

export const ErrorText = styled.Text`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  text-align: center;
  margin: ${props => props.theme.spacing.md}px 0;
  padding: ${props => props.theme.spacing.sm}px;
  background-color: ${props => props.theme.colors.error}15;
  border-radius: ${props => props.theme.borderRadius.md}px;
  border: 1px solid ${props => props.theme.colors.error}30;
`;