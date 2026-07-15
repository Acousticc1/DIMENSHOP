import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Trash2, Box, Eye } from 'lucide-react-native';
import { THEME } from '../../styles/theme';
import { useSellerStore } from '../../application/stores/useSellerStore';
import { MOCK_PRODUCTS } from '../../shared/constants/mockData';
import { Button } from '../../presentation/components/ui/Button';

export default function SellerProducts() {
  const router = useRouter();
  const { products, deleteProduct } = useSellerStore();

  // Combine store products and mock products to show a populated initial dashboard
  const allProducts = [
    ...products,
    ...MOCK_PRODUCTS.map(p => ({
      id: p.id,
      sellerId: 'mock-seller-id',
      categoryId: p.categoryId,
      title: p.title,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      stockQuantity: p.stockQuantity,
      status: (p.id === 'prod-2' ? 'processing' : 'active') as any,
      modelUrl: p.modelUrl,
      has3dModel: p.has3dModel,
      metadata: {},
      images: p.images.map((img, i) => ({ id: i.toString(), productId: p.id, imageUrl: img, sortOrder: i, isPrimary: i === 0 })),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'rgba(52, 199, 89, 0.15)', text: THEME.colors.success };
      case 'processing':
        return { bg: 'rgba(10, 132, 255, 0.15)', text: THEME.colors.info };
      case 'draft':
        return { bg: 'rgba(142, 142, 147, 0.15)', text: THEME.colors.textSecondary };
      default:
        return { bg: 'rgba(142, 142, 147, 0.15)', text: THEME.colors.textSecondary };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => router.push('/(seller)/product-form')}
        >
          <Plus color="#FFFFFF" size={20} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {allProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Box size={64} color={THEME.colors.textSecondary} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptySub}>Add drafts and start generating 3D models.</Text>
          </View>
        ) : (
          allProducts.map(product => {
            const statusTheme = getStatusStyle(product.status);
            const primaryImage = product.images?.[0]?.imageUrl || (product as any).imageUrl;

            return (
              <View key={product.id} style={styles.productCard}>
                {primaryImage ? (
                  <Image source={{ uri: primaryImage }} style={styles.productImg} />
                ) : (
                  <View style={styles.placeholderImg} />
                )}

                <View style={styles.infoCol}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusTheme.bg }]}>
                      <Text style={[styles.statusText, { color: statusTheme.text }]}>
                        {product.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                  <Text style={styles.stock}>Stock: {product.stockQuantity} units</Text>

                  <View style={styles.actionsRow}>
                    {product.has3dModel && (
                      <View style={styles.badge3d}>
                        <Text style={styles.badge3dText}>3D MODEL READY</Text>
                      </View>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.deleteBtn}
                      onPress={() => deleteProduct(product.id)}
                    >
                      <Trash2 size={16} color={THEME.colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 16,
  },
  productImg: {
    width: 80,
    height: 80,
    borderRadius: THEME.borderRadius.md,
  },
  placeholderImg: {
    width: 80,
    height: 80,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: '#1E1E22',
  },
  infoCol: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  price: {
    color: THEME.colors.textLight,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  stock: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  badge3d: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  badge3dText: {
    color: '#818CF8',
    fontSize: 9,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 'auto',
  },
});
