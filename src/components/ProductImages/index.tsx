import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ProductImagesProps {
  images: string[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const windowWidth = Dimensions.get('window').width - 80;
  const flatListRef = useRef<FlatList>(null);
  
  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ 
        index, 
        animated: true,
        viewPosition: 0.5
      });
    }
  };

  const handleNext = () => {
    // Ensure we don't go beyond the images array
    const isLastVisible = selectedImage >= images.length - 1;
    const newIndex = isLastVisible ? 0 : selectedImage + 1;
    setSelectedImage(newIndex);
    scrollToIndex(newIndex);
  };

  const handlePrevious = () => {
    // Ensure we don't go below index 0
    const isFirstVisible = selectedImage <= 0;
    const newIndex = isFirstVisible ? images.length - 1 : selectedImage - 1;
    setSelectedImage(newIndex);
    scrollToIndex(newIndex);
  };
  
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: images[selectedImage] }}
        style={[styles.mainImage, { width: windowWidth }]}
        resizeMode="contain"
      />
      
      <View style={styles.thumbnailContainer}>
        <TouchableOpacity 
          style={styles.arrowButton} 
          onPress={handlePrevious}
        >
          <Icon name="chevron-back" size={20} color="#00008B" />
        </TouchableOpacity>
        
        <FlatList
          ref={flatListRef}
          horizontal
          data={images}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailList}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              onPress={() => setSelectedImage(index)}
              style={selectedImage === index ? styles.activeThumbnail : styles.thumbnail}
            >
              <Image 
                source={{ uri: item }} 
                style={styles.thumbnailImage} 
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          getItemLayout={(_, index) => ({
            length: 70,
            offset: 70 * index,
            index,
          })}
        />
        
        <TouchableOpacity 
          style={styles.arrowButton} 
          onPress={handleNext}
        >
          <Icon name="chevron-forward" size={20} color="#00008B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductImages;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    paddingVertical: 15,
    alignItems: 'center',
  },
  mainImage: {
    height: 280,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  arrowButton: {
    backgroundColor: '#F1F1F1',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnailList: {
    maxWidth: Dimensions.get('window').width - 100, 
    marginHorizontal: 5,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 5,
  },
  activeThumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#00008B',
    padding: 5,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});