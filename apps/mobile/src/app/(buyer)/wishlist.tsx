import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { THEME } from '../../styles/theme';
import { useWishlistStore } from '../../application/stores/useWishlistStore';
import { ProductCard } from '../../presentation/components/product/ProductCard';

export default function BuyerWishlist() {
  const router = useRouter();
  const { items } = useWishlistStore();

  const handleProductPress = (id: string) => {
    router.push({
      pathname: '/(buyer)/detail',
      params: { id },
    });
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Heart size={64} color={THEME.colors.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.emptyTextTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptyTextSub}>Save products here to keep track of items you like.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {items.map(item => (
            <ProductCard
              key={item.id}
              product={{
                id: item.productId,
                title: item.product.title,
                price: item.product.price,
                imageUrl: item.product.imageUrl,
                has3dModel: item.product.has3dModel,
              }}
              onPress={() => handleProductPress(item.productId)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyTextTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyTextSub: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
