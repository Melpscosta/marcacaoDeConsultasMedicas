import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { View, ActivityIndicator, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Interface para as props do FeedbackMessage
interface FeedbackMessageProps {
  type: 'loading' | 'error' | 'success' | 'info';
  message?: string;
  visible: boolean;
}

// Componente principal de feedback
export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  message,
  visible,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Container type={type}>
      {type === 'loading' && (
        <ActivityIndicator
          size="small"
          color={theme.colors.white}
        />
      )}
      {type === 'error' && (
        <Ionicons
          name="alert-circle"
          size={20}
          color={theme.colors.white}
        />
      )}
      {type === 'success' && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={theme.colors.white}
        />
      )}
      {type === 'info' && (
        <Ionicons
          name="information-circle"
          size={20}
          color={theme.colors.white}
        />
      )}
      {message && (
        <MessageText>{message}</MessageText>
      )}
    </Container>
  );
};

// Componente de loading overlay
interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Carregando...',
}) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Overlay>
      <LoadingContainer>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
        <LoadingText>{message}</LoadingText>
      </LoadingContainer>
    </Overlay>
  );
};

// Componente de Toast para mensagens rápidas
interface ToastProps {
  type: 'error' | 'success' | 'info';
  message: string;
  visible: boolean;
  onHide?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  visible,
  onHide,
}) => {
  const theme = useTheme();

  React.useEffect(() => {
    if (visible && onHide) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000); // Auto-esconde após 3 segundos

      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <ToastContainer type={type}>
      <Ionicons
        name={
          type === 'error' ? 'alert-circle' :
          type === 'success' ? 'checkmark-circle' : 'information-circle'
        }
        size={20}
        color={theme.colors.white}
      />
      <ToastMessage>{message}</ToastMessage>
    </ToastContainer>
  );
};

// Componente de Badge de status
interface StatusBadgeProps {
  status: 'confirmed' | 'pending' | 'cancelled';
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return theme.colors.appointmentConfirmed;
      case 'pending':
        return theme.colors.appointmentPending;
      case 'cancelled':
        return theme.colors.appointmentCancelled;
      default:
        return theme.colors.textMuted;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <BadgeContainer
      backgroundColor={getStatusColor()}
      size={size}
    >
      <BadgeText size={size}>{getStatusText()}</BadgeText>
    </BadgeContainer>
  );
};

// Estilos
const Container = styled.View<{ type: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  margin-vertical: ${props => props.theme.spacing.sm}px;
  background-color: ${props => {
    switch (props.type) {
      case 'loading':
        return props.theme.colors.primary;
      case 'error':
        return props.theme.colors.error;
      case 'success':
        return props.theme.colors.success;
      case 'info':
        return props.theme.colors.info;
      default:
        return props.theme.colors.textMuted;
    }
  }};
`;

const MessageText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingContainer = styled.View`
  background-color: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl}px;
  border-radius: ${props => props.theme.borderRadius.lg}px;
  align-items: center;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const LoadingText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-top: ${props => props.theme.spacing.md}px;
  text-align: center;
`;

const ToastContainer = styled.View<{ type: string }>`
  position: absolute;
  top: 50px;
  left: 20px;
  right: 20px;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  background-color: ${props => {
    switch (props.type) {
      case 'error':
        return props.theme.colors.error;
      case 'success':
        return props.theme.colors.success;
      case 'info':
        return props.theme.colors.info;
      default:
        return props.theme.colors.textMuted;
    }
  }};
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
  z-index: 1000;
`;

const ToastMessage = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  margin-left: ${props => props.theme.spacing.sm}px;
  flex: 1;
`;

const BadgeContainer = styled.View<{
  backgroundColor: string;
  size: 'small' | 'medium'
}>`
  background-color: ${props => props.backgroundColor};
  padding-horizontal: ${props =>
    props.size === 'small'
      ? props.theme.spacing.sm
      : props.theme.spacing.md
  }px;
  padding-vertical: ${props =>
    props.size === 'small'
      ? props.theme.spacing.xs
      : props.theme.spacing.sm
  }px;
  border-radius: ${props => props.theme.borderRadius.sm}px;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text<{ size: 'small' | 'medium' }>`
  color: ${props => props.theme.colors.white};
  font-size: ${props =>
    props.size === 'small'
      ? props.theme.typography.small.fontSize
      : props.theme.typography.caption.fontSize
  }px;
  font-weight: 600;
`;