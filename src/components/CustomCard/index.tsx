import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList
} from 'react-native';

interface CustomCardProps {
  title?: string;
  description?: string;
  image?: any;
  onPress?: () => void;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  description,
  image,
  onPress,
}) => {
  return (
    <View style={styles.cardContainer} onTouchEnd={onPress}>
      <ImageBackground
        source={{uri: image}}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: 180,
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 10, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#82C8E5', 
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  description: {
    color: '#F3FAFC',
    fontSize: 12,
    lineHeight: 10,
  },
});
