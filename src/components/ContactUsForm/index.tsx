import {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import CustomInputField from '../InputFields';
import CustomButton from '../Button';
import {useMutation} from '@tanstack/react-query';
import {QueryFormPayload, submitQueryForm} from '../../apis/submitQueryForm';

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
  });

  const {mutate: submitQuery, isPending} = useMutation({
    mutationFn: async (formData: QueryFormPayload) => {
      return await submitQueryForm({payload: formData});
    },
    onSuccess: () => {
      Alert.alert('Success', 'Form submitted successfully');
      setFormData({name: '', email: '', subject: ''});
    },
  });

  const handleSubmitForm = async () => {
    if (!formData.name || !formData.email || !formData.subject) {
      Alert.alert('Error','Please fill all the fields');
      return;
    }
    submitQuery(formData);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Love to hear from you, Let’s connect!</Text>
      <Text style={styles.subHeading}>
        Have questions or ideas to share? We're just a message away—let’s make
        something great together!
      </Text>
      <CustomInputField
        value={formData.name}
        onChangeText={text => setFormData({...formData, name: text})}
        placeholder="Jane Doe"
        label="Name"
      />
      <CustomInputField
        value={formData.email}
        onChangeText={text => setFormData({...formData, email: text})}
        placeholder="janedoe@gmail.com"
        label="Email"
      />
      <CustomInputField
        value={formData.subject}
        onChangeText={text => setFormData({...formData, subject: text})}
        placeholder="Write message here..."
        label="Message"
      />
      <CustomButton
        onPress={handleSubmitForm}
        title="Send Message"
        buttonWidth={100}
        borderRadius={40}
        isLoading={isPending}
      />
    </View>
  );
};

export default ContactUsForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 10,
    paddingHorizontal: 10
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#313131',
    marginBottom: 3,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '400',
    color: '#313131',
    marginBottom: 20,
  },
});
