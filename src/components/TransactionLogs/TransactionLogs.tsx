import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useQuery} from '@tanstack/react-query';
import {fetchTransactions} from '../../apis/fetchTransactions';

const paymentMethodLabel = method => {
  switch (method) {
    case 'upi':
      return 'UPI';
    case 'card':
      return 'Card';
    case 'netbanking':
      return 'Net Banking';
    case 'cod':
      return 'Cash on Delivery';
    case 'wallet':
      return 'Wallet';
    case 'cashfree':
      return 'Cashfree';
    default:
      return 'Other';
  }
};

const statusColor = status => {
  switch (status) {
    case 'success':
      return '#27ae60';
    case 'failed':
      return '#e74c3c';
    case 'pending':
      return '#f1c40f';
    case 'refunded':
      return '#2980b9';
    default:
      return '#888';
  }
};

const TransactionLogs = () => {
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

  const {
    data: transactionsRes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const transactionsData = transactionsRes?.response?.data?.data || [];
  const totalTransaction = transactionsRes?.response?.data?.total || 0;

  const renderHeader = () => (
    <View style={styles.topHeader}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>
        Transactions {totalTransaction > 0 ? `(${totalTransaction})` : ''}
      </Text>
    </View>
  );

  const renderTransaction = ({item}) => (
    <View
      style={[
        styles.transactionCard,
        {borderLeftColor: statusColor(item.status)},
      ]}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Icon
            name={
              item.status === 'success'
                ? 'checkmark-done'
                : item.status === 'failed'
                ? 'close'
                : item.status === 'refunded'
                ? 'refresh'
                : 'time'
            }
            size={22}
            color={statusColor(item.status)}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.amount}>₹{item.amount}</Text>
          <View style={styles.methodRow}>
            <View style={styles.methodPill}>
              <Icon
                name={
                  item.payment_method === 'upi'
                    ? 'logo-google'
                    : item.payment_method === 'card'
                    ? 'card'
                    : item.payment_method === 'netbanking'
                    ? 'business'
                    : 'wallet'
                }
                size={14}
                color="#2B9AFF"
                style={{marginRight: 4}}
              />
              <Text style={styles.methodText}>
                {paymentMethodLabel(item.payment_method)}
              </Text>
              {(item.status === 'refunded' || item.status === 'success') && (
                <View
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor:
                        item.status === 'refunded' ? '#eaf6ff' : '#eafaf1',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusChipText,
                      {
                        color:
                          item.status === 'refunded' ? '#2980b9' : '#27ae60',
                      },
                    ]}>
                    {item.status === 'refunded' ? 'Refunded' : 'Success'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.dateCol}>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
      {/* <View style={styles.detailsRow}>
        <Text style={styles.label}>Order ID: </Text>
        <Text style={styles.value}>{item.order._id}</Text>
      </View> */}
      <View style={styles.detailsRow}>
        <Text style={styles.label}>Txn ID: </Text>
        <Text style={styles.value}>{item.transaction_id}</Text>
      </View>
      {item.status === 'refunded' && (
        <View style={styles.refundBox}>
          <Icon
            name="refresh"
            size={14}
            color="#2980b9"
            style={{marginRight: 4}}
          />
          <Text style={styles.refundText}>
            Refunded: {item.refund_reason || 'No reason provided'}
          </Text>
          <Text style={styles.refundText}>
            On:{' '}
            {item.refund_date
              ? new Date(item.refund_date).toLocaleDateString()
              : ''}
          </Text>
        </View>
      )}
    </View>
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const safeTransactions = Array.isArray(transactionsData)
    ? transactionsData
    : [];

  return (
    <LinearGradient colors={['#e3e6ee', '#bfc8e4']} style={styles.gradient}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2B9AFF" />
          </View>
        ) : safeTransactions.length > 0 ? (
          <FlatList
            data={safeTransactions}
            keyExtractor={item => item._id}
            renderItem={renderTransaction}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={renderHeader}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : (
          <>
            {renderHeader()}
            <View style={styles.emptyStateContainer}>
              <Icon
                name="card-outline"
                size={54}
                color="grey"
                style={{marginBottom: 12}}
              />
              <Text style={styles.emptyTitle}>No Transactions Yet</Text>
              <Text style={styles.emptySubtitle}>
                You haven't made any payments yet.
              </Text>
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
};

export default TransactionLogs;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  backBtn: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#e3e6ee',
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B2B2B',
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  listContent: {
    paddingBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  transactionCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#27ae60', // default, will be overridden
  },
  cardShadow: {
    shadowColor: '#2ecc71',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    marginRight: 6,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  methodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf2fb',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  methodText: {
    fontSize: 13,
    color: '#2B9AFF',
    fontWeight: '600',
    marginRight: 6,
  },
  statusChip: {
    marginLeft: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'center',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 70,
    marginLeft: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    color: '#888',
    minWidth: 70,
  },
  value: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
  },
  refundBox: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf6ff',
    borderRadius: 8,
    padding: 8,
    gap: 4,
  },
  refundText: {
    fontSize: 12,
    color: '#2980b9',
    marginRight: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
