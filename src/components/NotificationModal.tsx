import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type NotificationType = 'success' | 'warning' | 'info';

interface NotificationModalProps {
  visible: boolean;
  type: NotificationType;
  title: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  confirmText = 'Đồng ý',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialogContainer}>
          <View
            style={[
              styles.iconCircle,
              type === 'success' && styles.iconCircleSuccess,
              type === 'warning' && styles.iconCircleWarning,
              type === 'info' && styles.iconCircleInfo,
            ]}
          >
            <Text style={styles.iconText}>{getIcon()}</Text>
          </View>

          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>

          <View style={styles.actionsContainer}>
            <Pressable
              onPress={onClose}
              hitSlop={6}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleSuccess: {
    backgroundColor: '#DCFCE7',
  },
  iconCircleWarning: {
    backgroundColor: '#FEF3C7',
  },
  iconCircleInfo: {
    backgroundColor: '#E0F2FE',
  },
  iconText: {
    fontSize: 28,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionsContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
