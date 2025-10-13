import React from 'react';
import styled from 'styled-components/native';
import { Image, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container>
      <UserInfo>
        <UserAvatar
          source={{ uri: user.image }}
        />
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
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md}px;
  padding-top: ${props => props.theme.spacing.xl}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  shadow-color: ${props => props.theme.colors.text};
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
  border: 2px solid ${props => props.theme.colors.white};
`;

const TextContainer = styled.View`
  margin-left: ${props => props.theme.spacing.md}px;
`;

const WelcomeText = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.white};
  opacity: 0.9;
`;

const UserName = styled.Text`
  font-size: ${props => props.theme.typography.subtitle.fontSize}px;
  font-weight: ${props => props.theme.typography.subtitle.fontWeight};
  color: ${props => props.theme.colors.white};
`;

export default Header;