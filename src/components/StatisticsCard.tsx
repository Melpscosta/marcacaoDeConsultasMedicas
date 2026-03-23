import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';
import theme from '../styles/theme';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  color = theme.colors.primary,
  icon,
  style,
}) => {
  return (
    <Container style={style} color={color}>
      <Header>
        {icon && <IconContainer>{icon}</IconContainer>}
        <Title>{title}</Title>
      </Header>
      <Value color={color}>{value}</Value>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
};

const Container = styled.View<{ color: string }>`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  margin: ${props => props.theme.spacing.sm}px;
  min-height: 120px;
  justify-content: space-between;
  border-left-width: 4px;
  border-left-color: ${(props) => props.color};
  shadow-color: ${props => props.theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const IconContainer = styled.View`
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const Title = styled.Text`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.body.fontWeight};
  opacity: 0.8;
`;

const Value = styled.Text<{ color: string }>`
  font-size: ${props => props.theme.typography.heading.fontSize}px;
  font-weight: ${props => props.theme.typography.heading.fontWeight};
  color: ${(props) => props.color};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const Subtitle = styled.Text`
  font-size: ${props => props.theme.typography.small.fontSize}px;
  color: ${props => props.theme.colors.textMuted};
`;

export default StatisticsCard;