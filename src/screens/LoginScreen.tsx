import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { FeedbackMessage, Toast } from '../components/FeedbackMessages';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation<LoginScreenProps['navigation']>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [toast, setToast] = useState({
    visible: false,
    type: 'error' as 'error' | 'success' | 'info',
    message: '',
  });

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação dos campos
  const validateFields = (): boolean => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('O email é obrigatório');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Digite um email válido');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('A senha é obrigatória');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signIn({ email, password });

      // Sucesso - mostrar feedback positivo
      setToast({
        visible: true,
        type: 'success',
        message: 'Login realizado com sucesso!',
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Email ou senha inválidos';
      setError(errorMessage);
      setToast({
        visible: true,
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Senha',
      'Um email de recuperação será enviado para o seu endereço de email.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'OK', onPress: () => console.log('Recuperação de senha') },
      ]
    );
  };

  return (
    <Container>
      <HeaderContainer>
        <LogoContainer>
          <Ionicons name="medical" size={48} color={theme.colors.primary} />
        </LogoContainer>
        <Title>HealthConnect</Title>
        <Subtitle>Sistema de Marcação de Consultas</Subtitle>
      </HeaderContainer>

      <FormContainer>
        <WelcomeText>Bem-vindo de volta!</WelcomeText>
        <InstructionText>Faça login para acessar suas consultas</InstructionText>

        <InputContainer>
          <InputWrapper>
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.colors.textMuted}
              style={styles.inputIcon}
            />
            <StyledInput
              placeholder="Email"
              placeholderTextColor={theme.colors.textMuted}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </InputWrapper>
          {emailError ? <ErrorText>{emailError}</ErrorText> : null}
        </InputContainer>

        <InputContainer>
          <InputWrapper>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.colors.textMuted}
              style={styles.inputIcon}
            />
            <StyledInput
              placeholder="Senha"
              placeholderTextColor={theme.colors.textMuted}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          </InputWrapper>
          {passwordError ? <ErrorText>{passwordError}</ErrorText> : null}
        </InputContainer>

        <ForgotPasswordButton onPress={handleForgotPassword}>
          <ForgotPasswordText>Esqueceu a senha?</ForgotPasswordText>
        </ForgotPasswordButton>

        <LoginButton onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={theme.colors.white} size="small" />
          ) : (
            <LoginButtonText>Entrar</LoginButtonText>
          )}
        </LoginButton>

        <RegisterButton onPress={() => navigation.navigate('Register')}>
          <RegisterText>
            Ainda não tem uma conta? <RegisterLink>Cadastre-se</RegisterLink>
          </RegisterText>
        </RegisterButton>

        <DemoCredentials>
          <DemoTitle>Contas de Demonstração:</DemoTitle>
          <DemoText>
            <DemoLabel>Administrador:</DemoLabel> admin@example.com / 123456
          </DemoText>
          <DemoText>
            <DemoLabel>Médico:</DemoLabel> joao@example.com / 123456
          </DemoText>
          <DemoText>
            <DemoLabel>Paciente:</DemoLabel> maria@example.com / 123456
          </DemoText>
        </DemoCredentials>
      </FormContainer>

      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </Container>
  );
};

const styles = {
  inputIcon: {
    marginLeft: 16,
  },
  eyeIcon: {
    marginRight: 16,
    padding: 4,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const HeaderContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: ${props => props.theme.spacing.xl}px;
  padding-top: ${props => props.theme.spacing.xxl}px;
`;

const LogoContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.xl}px;
  background-color: ${props => props.theme.colors.primaryLight};
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg}px;
  shadow-color: ${props => props.theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const Title = styled.Text`
  font-size: ${props => props.theme.typography.title.fontSize}px;
  font-weight: ${props => props.theme.typography.title.fontWeight};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm}px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const FormContainer = styled.View`
  flex: 2;
  background-color: ${props => props.theme.colors.surface};
  border-top-left-radius: ${props => props.theme.borderRadius.xxl}px;
  border-top-right-radius: ${props => props.theme.borderRadius.xxl}px;
  padding-horizontal: ${props => props.theme.spacing.xl}px;
  padding-top: ${props => props.theme.spacing.xxl}px;
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 10;
`;

const WelcomeText = styled.Text`
  font-size: ${props => props.theme.typography.heading.fontSize}px;
  font-weight: ${props => props.theme.typography.heading.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const InstructionText = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const InputContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md}px;
  border: 1px solid ${props => props.theme.colors.border};
  height: ${props => props.theme.sizes.inputHeight.md}px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
`;

const ErrorText = styled.Text`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.small.fontSize}px;
  margin-top: ${props => props.theme.spacing.xs}px;
  margin-left: ${props => props.theme.spacing.md}px;
`;

const ForgotPasswordButton = styled.TouchableOpacity`
  align-items: flex-end;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const ForgotPasswordText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: 500;
`;

const LoginButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md}px;
  height: ${props => props.theme.sizes.buttonHeight.lg}px;
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg}px;
  shadow-color: ${props => props.theme.colors.primary};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 4;
`;

const LoginButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: 600;
`;

const RegisterButton = styled.TouchableOpacity`
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const RegisterText = styled.Text`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.body.fontSize}px;
`;

const RegisterLink = styled.Text`
  color: ${props => props.theme.colors.secondary};
  font-weight: 600;
`;

const DemoCredentials = styled.View`
  background-color: ${props => props.theme.colors.primaryLight};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const DemoTitle = styled.Text`
  font-size: ${props => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  color: ${props => props.theme.colors.primaryDark};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const DemoText = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const DemoLabel = styled.Text`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export default LoginScreen; 