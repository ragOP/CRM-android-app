import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {pick} from '@react-native-documents/picker';

const PrescriptionUpload = ({prescriptionFile, onUpload, onRemove}) => {
  const handleUpload = async () => {
    try {
      const res = await pick({
        allowMultiSelection: false,
        type: ['image/*', 'application/pdf'],
      });
      if (res && res.length > 0) {
        onUpload(res[0]);
      }
    } catch (err) {
      // User cancelled or error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        Prescription is required for some products in your cart. Please upload a
        valid prescription to proceed with the order.
      </Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
          <Text style={styles.uploadBtnText}>
            {prescriptionFile ? 'Change Prescription' : 'Upload Prescription'}
          </Text>
        </TouchableOpacity>
        {prescriptionFile && (
          <>
            <Text
              style={styles.fileName}
              numberOfLines={1}
              ellipsizeMode="tail">
              {prescriptionFile.name ||
                prescriptionFile.fileName ||
                prescriptionFile.uri?.split('/').pop()}
            </Text>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={onRemove}
              accessibilityLabel="Remove prescription">
              <Icon name="close-circle" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFFBEA',
    borderWidth: 1,
    borderColor: '#FFE29A',
    borderRadius: 8,
  },
  infoText: {
    color: '#B7791F',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  uploadBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  fileName: {
    fontSize: 12,
    color: '#15803d',
    maxWidth: 120,
    marginLeft: 8,
    flexShrink: 1,
  },
  removeBtn: {
    marginLeft: 4,
    padding: 2,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
});

export default PrescriptionUpload;
