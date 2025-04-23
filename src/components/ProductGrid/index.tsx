import React from 'react';
import {FlatList, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import ProductCard from '../ProductCard';

interface ProductGridProps {
  rows?: number;
  title: string;
  highlight?: {[key: string]: boolean};
  data: any;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  rows = 2,
  title = '',
  highlight = {},
  data,
}) => {
  return (
    <View style={{padding: 16}}>
      <View style={styles.header}>
          <Text style={styles.saleText}>
            {title.split(' ').map((word, index) => {
              const lowerWord = word.toLowerCase().replace(/[^a-z0-9%]/gi, '');
              return (
                <Text
                  key={index}
                  style={highlight[lowerWord] ? styles.highlight : null}>
                  {word + ' '}
                </Text>
              );
            })}
          </Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>view all →</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={({item}) => <ProductCard {...item} />}
        keyExtractor={item => item.id}
        numColumns={rows}
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    </View>
  );
};

export default ProductGrid;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  saleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAll: {
    color: '#00008B',
    fontWeight: 'bold',
  },
  highlight: {
    color: '#00008B',
  },
});
