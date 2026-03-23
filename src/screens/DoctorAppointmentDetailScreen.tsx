import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { ScreenHeader } from '../components/ui';
import { getAppointmentById, updateAppointmentStatus, getMessages, addMessage } from '../services/storage';
import StatusBadge from '../components/StatusBadge';
import theme from '../styles/theme';
import type { RootStackParamList, Appointment, Message } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type DoctorAppointmentDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorAppointmentDetail'>;
  route: RouteProp<RootStackParamList, 'DoctorAppointmentDetail'>;
};

const DoctorAppointmentDetailScreen: React.FC<DoctorAppointmentDetailScreenProps> = ({ navigation, route }) => {
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

  const handleAccept = async () => {
    if (!appointment) return;
    await updateAppointmentStatus(appointment.id, 'confirmed');
    await loadData();
  };

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

  if (!appointment) {
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
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Paciente</Text>
              <Text style={styles.infoValue}>{appointment.patientName || 'Paciente'}</Text>
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
              <Text style={styles.observationTitle}>Observação do paciente</Text>
              <Text style={styles.observationText}>{appointment.description}</Text>
            </View>
          )}

          {appointment.status === 'pending' && (
            <TouchableOpacity
              onPress={handleAccept}
              style={styles.acceptButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Aceitar consulta"
            >
              <Icon name="checkmark-circle" type="ionicon" size={24} color={theme.colors.white} />
              <Text style={styles.acceptButtonText}>Aceitar consulta</Text>
            </TouchableOpacity>
          )}

          {canSendMessages && (
            <View style={styles.messagesSection}>
              <Text style={styles.messagesTitle}>Mensagens</Text>
              {messages.map((msg) => {
                const isDoctor = msg.senderId === user?.id;
                return (
                  <View key={msg.id} style={[styles.messageBubble, isDoctor ? styles.messageBubbleDoctor : styles.messageBubblePatient]}>
                    <Text style={[styles.messageSender, isDoctor && styles.messageSenderDoctor]}>{msg.senderName}</Text>
                    <Text style={[styles.messageText, isDoctor && styles.messageTextDoctor]}>{msg.text}</Text>
                  </View>
                );
              })}
            </View>
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
            style={[styles.sendButton, !newMessage.trim() && { opacity: 0.5 }]}
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
    backgroundColor: theme.colors.successMuted,
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
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    minHeight: theme.touchTarget,
  },
  acceptButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.white,
  },
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
  messageBubbleDoctor: { backgroundColor: theme.colors.primary, alignSelf: 'flex-end' },
  messageBubblePatient: { backgroundColor: theme.colors.border, alignSelf: 'flex-start' },
  messageSender: {
    fontSize: theme.typography.small.fontSize,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  messageSenderDoctor: { color: 'rgba(255,255,255,0.9)' },
  messageText: { fontSize: theme.typography.body.fontSize, color: theme.colors.text },
  messageTextDoctor: { color: theme.colors.white },
  messageInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
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
});

export default DoctorAppointmentDetailScreen;
