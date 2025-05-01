import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface LaundryServiceCardProps {
  service_id: string;
  serviceType: string;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  serviceIndex: number;
  handleAddToCart: (product_id: string) => void;
  isPending: boolean;
}

const LaundryServiceCard: React.FC<LaundryServiceCardProps> = ({
  service_id,
  serviceType,
  price,
  originalPrice,
  description,
  features,
  serviceIndex,
  handleAddToCart,
  isPending,
}) => {
  console.log('features', features);
  console.log('Service Index:', serviceIndex);
  return (
    <View style={styles.card}>
      <Text style={styles.serviceType}>{serviceType}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.priceSymbol}>₹</Text>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.priceDivider}>/</Text>
        <Text style={styles.originalPrice}>{originalPrice}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>

      <Text style={styles.serviceTitle}>{serviceType}</Text>

      <View style={styles.featuresContainer}>
        {features.map(
          (feature, index) =>
            index !== 0 && (
              <View key={index} style={styles.featureRow}>
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✔</Text>
                </View>
                {serviceIndex === 0 ? (
                  feature.split('\n').map((subFeature, subIndex) => (
                    <>
                      <Text key={subIndex} style={styles.featureText}>
                        {subFeature}
                      </Text>
                      <View style={{height: 50}}></View>
                    </>
                  ))
                ) : (
                  <Text style={styles.featureText}>{feature}</Text>
                )}
              </View>
            ),
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log('Service ID:', service_id);
          handleAddToCart(service_id);
        }}>
        <Text style={styles.addButtonText}>
          {isPending ? 'Loading....' : 'Add to Cart'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 'auto',
    width: 320,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  priceSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 5,
  },
  priceDivider: {
    fontSize: 20,
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 20,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  featuresContainer: {
    marginVertical: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // marginBottom: 6,
  },
  checkmarkContainer: {
    width: 20,
    marginRight: 10,
  },
  checkmark: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#00008B',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LaundryServiceCard;
