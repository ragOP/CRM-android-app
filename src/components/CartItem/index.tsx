import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CartItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    price: number;
    mrp: number;
    discountPercentage: number;
    quantity: number;
    image: string;
  };
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onQuantityChange,
}) => (
  <View style={styles.cartItemContainer}>
    <Image source={{uri: item.image}} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <Text style={styles.itemMrp}>₹{item.mrp}</Text>
        <Text style={styles.itemDiscount}>{item.discountPercentage}% off</Text>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() =>
              onQuantityChange(item.id, Math.max(1, item.quantity - 1))
            }
            style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => onQuantityChange(item.id, item.quantity + 1)}
            style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          style={styles.removeButton}>
          <Icon name="trash-can-outline" size={20} color="#FB6969" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default CartItem;

const styles = StyleSheet.create({
  cartItemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#1A1A1A'
  },
  itemDescription: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#1A1A1A'
  },
  itemMrp: {
    fontSize: 14,
    color: '#4D4D4D',
    marginRight: 8,
    textDecorationLine: 'line-through',
  },
  itemDiscount: {
    fontSize: 14,
    color: '#297C00',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#00008B',
    borderWidth: 1,
    borderRadius: 20,
  },
  quantityButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00008B',
  },
  quantityText: {
    fontSize: 14,
    paddingHorizontal: 15,
  },
  removeButton: {
    padding: 8,
  },
});
