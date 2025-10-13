import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Toast } from '../components/FeedbackMessages';
import { getProfileImage } from '../services/profileImages';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
  const navigation = useNavigation<RegisterScreenProps['navigation']>();

  // Estado do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
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

  // Validação do nome
  const validateName = (name: string): boolean => {
    return name.trim().length >= 3 && /^[a-zA-ZÀ-ú\s]+$/.test(name.trim());
  };

  // Validação de senha
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Validação completa do formulário
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validação do nome
    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    } else if (!validateName(name)) {
      newErrors.name = 'Digite um nome válido (mínimo 3 caracteres)';
    }

    // Validação do email
    if (!email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Digite um email válido';
    }

    // Validação da senha
    if (!password) {
      newErrors.password = 'A senha é obrigatória';
    } else if (!validatePassword(password)) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }

    // Validação da confirmação de senha
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      // Sucesso - mostrar feedback positivo
      setToast({
        visible: true,
        type: 'success',
        message: 'Cadastro realizado com sucesso! Faça login para continuar.',
      });

      // Aguardar um pouco antes de navegar
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);

    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao criar conta. Tente novamente.';
      setToast({
        visible: true,
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Limpar erro do campo específico ao digitar
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }

    // Atualizar o estado do campo
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <HeaderContainer>
          <LogoContainer>
            <Ionicons name="person-add-outline" size={40} color={theme.colors.primary} />
          </LogoContainer>
          <Title>Criar Conta</Title>
          <Subtitle>Cadastre-se para agendar suas consultas</Subtitle>
        </HeaderContainer>

        <FormContainer>
          <InputContainer>
            <InputWrapper>
              <Ionicons
                name="person-outline"
                size={20}
                color={theme.colors.textMuted}
                style={styles.inputIcon}
              />
              <StyledInput
                placeholder="Nome completo"
                placeholderTextColor={theme.colors.textMuted}
                value={name}
                onChangeText={(text) => handleInputChange('name', text)}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </InputWrapper>
            {errors.name ? <ErrorText>{errors.name}</ErrorText> : null}
          </InputContainer>

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
                onChangeText={(text) => handleInputChange('email', text)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </InputWrapper>
            {errors.email ? <ErrorText>{errors.email}</ErrorText> : null}
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
                onChangeText={(text) => handleInputChange('password', text)}
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
            {errors.password ? <ErrorText>{errors.password}</ErrorText> : null}
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
                placeholder="Confirmar senha"
                placeholderTextColor={theme.colors.textMuted}
                value={confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            </InputWrapper>
            {errors.confirmPassword ? <ErrorText>{errors.confirmPassword}</ErrorText> : null}
          </InputContainer>

          <PasswordRequirements>
            <RequirementTitle>Requisitos da senha:</RequirementTitle>
            <RequirementItem valid={password.length >= 6}>
              <Ionicons
                name={password.length >= 6 ? "checkmark-circle" : "ellipse-outline"}
                size={16}
                color={password.length >= 6 ? theme.colors.success : theme.colors.textMuted}
              />
              <RequirementText>Pelo menos 6 caracteres</RequirementText>
            </RequirementItem>
          </PasswordRequirements>

          <RegisterButton onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={theme.colors.white} size="small" />
            ) : (
              <RegisterButtonText>Cadastrar</RegisterButtonText>
            )}
          </RegisterButton>

          <LoginButton onPress={() => navigation.navigate('Login')}>
            <LoginText>
              Já tem uma conta? <LoginLink>Faça login</LoginLink>
            </LoginText>
          </LoginButton>

          <TermsContainer>
            <TermsText>
              Ao se cadastrar, você concorda com nossos{' '}
              <TermsLink>Termos de Serviço</TermsLink> e{' '}
              <TermsLink>Política de Privacidade</TermsLink>
            </TermsText>
          </TermsContainer>
        </FormContainer>
      </ScrollView>

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
  align-items: center;
  padding-horizontal: ${props => props.theme.spacing.xl}px;
  padding-top: ${props => props.theme.spacing.xxl}px;
  padding-bottom: ${props => props.theme.spacing.lg}px;
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
  shadow-offset: { width: 0, height: 4 };
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const Title = styled.Text`
  font-size: ${props => props.theme.typography.title.fontSize}px;
  font-weight: ${props => props.theme.typography.title.fontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const FormContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.surface};
  border-top-left-radius: ${props => props.theme.borderRadius.xxl}px;
  border-top-right-radius: ${props => props.theme.borderRadius.xxl}px;
  padding-horizontal: ${props => props.theme.spacing.xl}px;
  padding-top: ${props => props.theme.spacing.xxl}px;
  padding-bottom: ${props => props.theme.spacing.xl}px;
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

const PasswordRequirements = styled.View`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const RequirementTitle = styled.Text`
  font-size: ${props => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const RequirementItem = styled.View<{ valid: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const RequirementText = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.textLight};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const RegisterButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md}px;
  height: ${props => props.theme.sizes.buttonHeight.lg}px;
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg}px;
  shadow-color: ${props => props.theme.colors.primary};
  shadow-offset: { width: 0, height: 2 };
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 4;
`;

const RegisterButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: 600;
`;

const LoginButton = styled.TouchableOpacity`
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const LoginText = styled.Text`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.body.fontSize}px;
`;

const LoginLink = styled.Text`
  color: ${props => props.theme.colors.secondary};
  font-weight: 600;
`;

const TermsContainer = styled.View`
  align-items: center;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const TermsText = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
  text-align: center;
  line-height: 18px;
`;

const TermsLink = styled.Text`
  color: ${props => props.theme.colors.primary};
  text-decoration: underline;
`;

export default RegisterScreen; 