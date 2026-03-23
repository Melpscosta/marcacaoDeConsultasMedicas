import styled from 'styled-components/native';
import { Image, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import theme from '../styles/theme';

const Header: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const avatarUri = (user as { image?: string; avatar?: string }).image || (user as { avatar?: string }).avatar;

  return (
    <Container>
      <UserInfo>
        <UserAvatar source={{ uri: avatarUri || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }} />
        <TextContainer>
          <WelcomeText>Bem-vindo(a),</WelcomeText>
          <UserName>{user.name}</UserName>
        </TextContainer>
      </UserInfo>
      <NotificationBell />
    </Container>
  );
};

const Container = styled.View`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.md}px;
  padding-top: ${theme.spacing.xl}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 4;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  border: 2px solid ${theme.colors.white};
`;

const TextContainer = styled.View`
  margin-left: ${theme.spacing.md}px;
`;

const WelcomeText = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.white};
  opacity: 0.9;
`;

const UserName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.white};
`;

export default Header;
