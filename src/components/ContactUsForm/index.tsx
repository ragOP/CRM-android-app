import { View, Text, StyleSheet, TextInput } from 'react-native';
import CustomInputField from '../InputFields';
import CustomButton from '../Button';

const ContactUsForm = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Love to hear from you, Let’s connect!</Text>
            <Text style={styles.subHeading}>Have questions or ideas to share? We're just a message away—let’s make something great together!</Text>
            <CustomInputField placeholder='Jane Doe' label='Name' />
            <CustomInputField placeholder='janedoe@gmail.com' label='Email' />
            <CustomInputField placeholder='Write message here...' label='Message' />
            <CustomButton title='Send Message' buttonWidth={100} borderRadius={40} onPress={() => {}} />
        </View>
    );
}

export default ContactUsForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        margin: 10
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        color: '#313131',
        marginBottom: 3
    },
    subHeading: {
        fontSize: 14,
        fontWeight: '400',
        color: '#313131',
        marginBottom: 20
    }
});