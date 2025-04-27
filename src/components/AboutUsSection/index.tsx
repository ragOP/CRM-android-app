import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

interface AboutUsProps {
  title: string;
  description: string;
  buttonText: string;
  imageSource: any;
}

const index: React.FC<AboutUsProps> = ({ title, description, buttonText, imageSource }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.title}>{title} </Text>
        <Text style={styles.description}>
         {description}
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rightContainer}>
        <Image
          style={styles.image}
          source={imageSource}
        />
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#82C8E533',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
    marginBottom: 3,
  },
  description: {
    fontSize: 6,
    fontWeight: '400',
    color: '#000',
    marginBottom: 5,
  },

  leftContainer: {
    flex: 2 / 5,
    justifyContent: 'center',
    padding: 10,
  },
  rightContainer: {
    flex: 3 / 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    backgroundColor: '#00008B',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    width: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '500',
  },
  image: {
    width: 200,
    height: 120,
    borderRadius: 20,
  },
});
