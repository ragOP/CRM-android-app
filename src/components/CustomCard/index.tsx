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
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  description,
  image,
}) => {
  return (
    <View style={styles.cardContainer}>
      <ImageBackground
        source={image}
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#82C8E5', 
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  description: {
    color: '#F3FAFC',
    fontSize: 7,
    lineHeight: 10,
  },
});
