import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { ScreenHeader } from '../components/ui';
import { getAppointmentById, getMessages, addMessage } from '../services/storage';
import StatusBadge from '../components/StatusBadge';
import theme from '../styles/theme';
import type { RootStackParamList, Appointment, Message } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type AppointmentDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AppointmentDetail'>;
  route: RouteProp<RootStackParamList, 'AppointmentDetail'>;
};

const AppointmentDetailScreen: React.FC<AppointmentDetailScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const loadData = useCallback(async () => {
    const apt = await getAppointmentById(appointmentId);
    setAppointment(apt);
    const msgs = await getMessages(appointmentId);
    setMessages(msgs);
  }, [appointmentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSendMessage = async () => {
    const text = newMessage.trim();
    if (!text || !user || !appointment) return;
    const msg: Message = {
      id: `msg_${Date.now()}`,
      appointmentId,
      senderId: user.id,
      senderName: user.name,
      text,
      createdAt: new Date().toISOString(),
    };
    await addMessage(msg);
    setNewMessage('');
    await loadData();
  };

  if (!appointment || appointment.patientId !== user?.id) {
    return null;
  }

  const canSendMessages = appointment.status === 'confirmed';

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Detalhes da Consulta"
        variant="primary"
        onBack={() => navigation.goBack()}
        accessibilityLabel="Detalhes da consulta"
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Math.max(insets.left, insets.right, theme.spacing.md),
          paddingBottom: 120 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={[styles.infoCard, theme.shadows.sm]}>
            <View style={styles.doctorRow}>
              <Image source={{ uri: appointment.doctor.image }} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
                <Text style={styles.specialty}>{appointment.doctor.specialty}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data e horário</Text>
              <Text style={styles.infoValue}>{appointment.date} às {appointment.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <StatusBadge status={appointment.status} />
            </View>
          </View>

          {appointment.description && (
            <View style={styles.observationCard}>
              <Text style={styles.observationTitle}>Sua observação</Text>
              <Text style={styles.observationText}>{appointment.description}</Text>
            </View>
          )}

          {canSendMessages && (
            <View style={styles.messagesSection}>
              <Text style={styles.messagesTitle}>Mensagens</Text>
              {messages.map((msg) => {
                const isPatient = msg.senderId === user?.id;
                return (
                  <View key={msg.id} style={[styles.messageBubble, isPatient ? styles.messageBubblePatient : styles.messageBubbleDoctor]}>
                    <Text style={[styles.messageSender, isPatient && styles.messageSenderPatient]}>{msg.senderName}</Text>
                    <Text style={[styles.messageText, isPatient && styles.messageTextPatient]}>{msg.text}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {appointment.status === 'pending' && (
            <Text style={styles.hintText}>Após o médico aceitar a consulta, você poderá trocar mensagens.</Text>
          )}
        </View>
      </ScrollView>

      {canSendMessages && (
        <View style={[styles.messageInputContainer, { paddingBottom: insets.bottom + theme.spacing.md }]}>
          <TextInput
            style={styles.messageInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={theme.colors.textMuted}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem"
          >
            <Icon name="send" type="ionicon" size={22} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  doctorImage: { width: 56, height: 56, borderRadius: 28, marginRight: theme.spacing.md },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: theme.typography.h3.fontSize, fontWeight: '600', color: theme.colors.text },
  specialty: { fontSize: theme.typography.caption.fontSize, color: theme.colors.textMuted },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: { fontSize: theme.typography.body.fontSize, color: theme.colors.textMuted },
  infoValue: { fontSize: theme.typography.body.fontSize, fontWeight: '500', color: theme.colors.text },
  observationCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  observationTitle: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  observationText: { fontSize: theme.typography.body.fontSize, color: theme.colors.text },
  messagesSection: { marginTop: theme.spacing.md },
  messagesTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  messageBubble: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    maxWidth: '85%',
  },
  messageBubblePatient: { backgroundColor: theme.colors.primary, alignSelf: 'flex-end' },
  messageBubbleDoctor: { backgroundColor: theme.colors.border, alignSelf: 'flex-start' },
  messageSender: { fontSize: theme.typography.small.fontSize, fontWeight: '600', color: theme.colors.textMuted, marginBottom: 4 },
  messageSenderPatient: { color: 'rgba(255,255,255,0.9)' },
  messageText: { fontSize: theme.typography.body.fontSize, color: theme.colors.text },
  messageTextPatient: { color: theme.colors.white },
  hintText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  messageInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    paddingHorizontal: Math.max(theme.spacing.md, 16),
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  messageInput: {
    flex: 1,
    minHeight: theme.touchTarget,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  sendButton: {
    width: theme.touchTarget,
    height: theme.touchTarget,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { opacity: 0.5 },
});

export default AppointmentDetailScreen;
