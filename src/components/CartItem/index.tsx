import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {calculateDiscountPercentage} from '../../utils/percentage/calculateDiscountPercentage';
import {getDiscountBasedOnRole} from '../../utils/products/getDiscountBasedOnRole';
import {useAppSelector} from '../../redux/store';
import {useState} from 'react';

interface CartItemProps {
  item: any;
  productQuantity: number;
  onRemove: () => void;
  onQuantityChange: (id: string, quantity: number, setIsLoading) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  productQuantity,
  onRemove,
  onQuantityChange,
}) => {
  const reduxAuth = useAppSelector(state => state.auth);
  const reduxUser = reduxAuth.user;
  const reduxUserRole = reduxUser?.role || 'user';
  const [isLoading, setIsLoading] = useState(false);

  const discountPrice = getDiscountBasedOnRole({
    role: reduxUserRole,
    discounted_price: item.discounted_price,
    original_price: item.price,
    salesperson_discounted_price: item.salesperson_discounted_price,
    dnd_discounted_price: item.dnd_discounted_price,
  });

  return (
    <View style={styles.cartItemContainer}>
      <Image source={{uri: item.images?.[0]}} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item?.name}</Text>
        <Text style={styles.itemDescription}>
          {item.small_description.slice(0, 50) + '...'}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>₹{discountPrice}</Text>
          <Text style={styles.itemMrp}>₹{item.price}</Text>
          <Text style={styles.itemDiscount}>
            {calculateDiscountPercentage(item.price, discountPrice)}% off
          </Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsLoading(true);
                onQuantityChange(
                  item,
                  Math.max(1, productQuantity - 1),
                  setIsLoading,
                );
              }}
              style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                }}>
                <ActivityIndicator size="small" color="#007BFF" />
              </View>
            ) : (
              <Text style={styles.quantityText}>{productQuantity}</Text>
            )}
            <TouchableOpacity
              onPress={() => {
                setIsLoading(true);
                onQuantityChange(item, productQuantity + 1, setIsLoading);
              }}
              style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => onRemove()}
            style={styles.removeButton}>
            <Icon name="trash-can-outline" size={20} color="#FB6969" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    color: '#1A1A1A',
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
    color: '#1A1A1A',
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
