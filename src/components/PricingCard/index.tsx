import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface PricingCardProps {
  title: string;
  price: string;
  billingPeriod: string;
  features: string[];
  buttonText?: string;
  onPress?: () => void;
  cardWidth?: number;
  highlight?: boolean;
  type?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  billingPeriod,
  features,
  buttonText = 'Book Now',
  onPress,
  cardWidth,
  highlight = false,
  type,
}) => {
  return (
    <View
      style={[
        styles.cardContainer,
        {width: cardWidth},
        highlight && styles.highlightCard,
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, highlight && {color: '#fff'}]}>
          {title}
        </Text>
        <Text style={[styles.price, highlight && {color: '#fff'}]}>
          {price}{' '}
          {highlight && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>- 15%</Text>
            </View>
          )}
        </Text>
        <Text style={[styles.billingPeriod, highlight && {color: '#AFAFAF'}]}>
          {billingPeriod}
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={[styles.type, highlight && {color: '#D8D8D8'}]}>
          {type}
        </Text>
        {features.map((feature, index) => (
          <Text
            key={index}
            style={[styles.feature, highlight && {color: '#fff'}]}>
            {feature}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          highlight && {backgroundColor: '#383FE5', borderWidth: 0},
        ]}
        onPress={onPress}>
        <Text style={[styles.buttonText, highlight && {color: '#F3FAFC'}]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  highlightCard: {
    backgroundColor: '#7B7DDE',
  },
  header: {
    marginBottom: 15,
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    color: '#333333',
    marginBottom: 5,
  },
  price: {
    fontSize: 28,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  billingPeriod: {
    fontSize: 14,
    color: '#333333',
  },
  type: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  feature: {
    fontSize: 16,
    color: '#4D4D4D',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#00008B',
    borderWidth: 1,
  },
  buttonText: {
    color: '#00008B',
    fontSize: 16,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#82C8E5CC',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default PricingCard;
