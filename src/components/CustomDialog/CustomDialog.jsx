import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Dialog, Portal, Button, Text} from 'react-native-paper';

const CustomDialog = ({
  visible,
  title = 'Alert',
  message,
  primaryLabel = 'OK',
  primaryAction,
  secondaryLabel = 'Cancel',
  secondaryAction,
  onDismiss,
}) => (
  <Portal>
    <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
      <Dialog.Title style={styles.title}>{title}</Dialog.Title>
      <Dialog.Content>
        <Text style={styles.message}>{message}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        {secondaryAction && (
          <Button
            onPress={secondaryAction}
            mode={'outlined'}
            style={styles.secondaryButton}>
            {secondaryLabel}
          </Button>
        )}
        <Button
          onPress={primaryAction}
          mode={'contained'}
          dark={true}
          buttonColor={'#1d4ed8'}
          style={styles.primaryButton}>
          {primaryLabel}
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  title: {
    color: '#00008B',
    fontWeight: 'bold',
    fontSize: 20,
  },
  message: {
    color: '#333',
    fontSize: 16,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  primaryButton: {
    color: '#00008B',
    paddingHorizontal: 10,
  },
  secondaryButton: {
    color: '#000',
    marginRight: 10,
    paddingHorizontal: 7,
  },
});

export default CustomDialog;
