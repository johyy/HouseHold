import { FlatList, View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
});

const products = [
  {
    id: '67938f8112d19c62da977bc8',
    name: 'Hammasharja',
    description: 'Perinteinen hammasharja, punainen',
    userId: '679294a924bab50c3d1ee425',
    locationId: '67938d8212d19c62da977bc6',
    categoryId: '6793888312d19c62da977bbe',
    expirationDate: '2025-12-31',
    quantity: 1,
    unit: 'pcs',
    createdAt: '2025-01-24 10:00:00',
    updatedAt: '2025-01-24 13:04:59.921',
  },
  {
    id: '6793c75951b5c5112bb87bb5',
    name: 'Saippua',
    description: 'Palmolive',
    userId: '679294a924bab50c3d1ee425',
    locationId: '67938d8212d19c62da977bc6',
    categoryId: '6793888312d19c62da977bbe',
    expirationDate: '2025-12-31',
    quantity: 1,
    unit: 'pcs',
    createdAt: '2025-01-24 19:01:13.687',
    updatedAt: '2025-01-24 19:03:54.596',
  },
];

const ItemSeparator = () => <View style={styles.separator} />;

const ProductItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.description}>{item.description}</Text>
  </View>
);

const ProductList = () => {
  return (
    <FlatList
      data={products}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductItem item={item} />}
    />
  );
};

export default ProductList;
