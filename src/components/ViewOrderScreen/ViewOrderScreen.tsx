import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useQuery} from '@tanstack/react-query';
import {fetchOrders} from '../../apis/fetchOrders';
import LinearGradient from 'react-native-linear-gradient';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';

const ViewOrdersScreen = () => {
  const navigation = useNavigation();

  const {data: ordersData, isLoading} = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const apiResponse = await fetchOrders();
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data;
      }
      return [];
    },
  });

  const renderOrder = ({item}: {item: (typeof ordersData)[0]}) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Order ID: {item._id}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>
      <Text style={styles.orderTotal}>
        Total Amount: ₹{item.totalAmount || 0}
      </Text>
      <Text style={styles.orderDate}>
        Date:{' '}
        {new Date(item.createdAt).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </Text>
      <Text style={styles.sectionTitle}>Items:</Text>
      {item.items.map((orderItem, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.itemName}>
            {orderItem.product.name} (x{orderItem.quantity})
          </Text>
          <Text style={styles.itemPrice}>
            ₹{orderItem.product.discounted_price.toFixed(2)}
          </Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Delivery Address:</Text>
      <Text style={styles.address}>
        {item.address.name}, {item.address.address}, {item.address.locality},{' '}
        {item.address.city}, {item.address.state} - {item.address.pincode}
      </Text>
      <Text style={styles.address}>📞 {item.address.mobile}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#e3e6ee', '#bfc8e4']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <Icon
            name="arrow-back"
            size={24}
            color="#000"
            onPress={() => navigation.navigate('UserProfileScreen')}
          />
          <Text style={styles.title}>Your Orders</Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : isArrayWithValues(ordersData) ? (
          <FlatList
            data={ordersData}
            keyExtractor={item => item._id}
            renderItem={renderOrder}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Icon
              name="cube-outline"
              size={54}
              color="#bfc8e4"
              style={{marginBottom: 12}}
            />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>
              You haven't placed any orders yet.
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default ViewOrdersScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loader: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#007AFF',
  },
  address: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
});
