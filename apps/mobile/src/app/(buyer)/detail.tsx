import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Heart, Rotate3d, ShoppingBag, Eye } from 'lucide-react-native';
import { THEME } from '../../styles/theme';
import { ImageGallery } from '../../presentation/components/product/ImageGallery';
import { ThreeDViewer } from '../../presentation/components/viewer/ThreeDViewer';
import { ViewerFallback } from '../../presentation/components/viewer/ViewerFallback';
import { MOCK_PRODUCTS } from '../../shared/constants/mockData';
import { useCartStore } from '../../application/stores/useCartStore';
import { useWishlistStore } from '../../application/stores/useWishlistStore';
import { Button } from '../../presentation/components/ui/Button';
import { logger } from '../../shared/utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem, isLoading: isAdding } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  const [view3d, setView3d] = useState(false);
  const [lowPerfFallback, setLowPerfFallback] = useState(false);

  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const isFavorite = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.errorBtn} />
      </SafeAreaView>
    );
  }

  const handleAddToCart = async () => {
    try {
      logger.info('Adding product to cart from details', { id: product.id });
      await addItem(product.id, {
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
      });
      logger.info('Added successfully');
    } catch (err) {
      logger.error('Failed to add item to cart', err);
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id, {
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      has3dModel: product.has3dModel,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Detail Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.title}</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={handleToggleWishlist}>
          <Heart 
            color={isFavorite ? '#FF453A' : '#FFFFFF'} 
            fill={isFavorite ? '#FF453A' : 'transparent'} 
            size={22} 
          />
        </TouchableOpacity>
      </View>

        {/* Toggle between 3D Viewer and Image Gallery */}
        {view3d && product.modelUrl && !lowPerfFallback ? (
          <View style={styles.viewerContainer}>
            <ThreeDViewer 
              modelUrl={product.modelUrl} 
              onLowPerformance={() => {
                setLowPerfFallback(true);
                setView3d(false);
              }}
            />
            <TouchableOpacity 
              style={styles.galleryToggleBtn}
              onPress={() => setView3d(false)}
            >
              <Text style={styles.galleryToggleBtnText}>Switch to Photo Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {lowPerfFallback ? (
              <ViewerFallback 
                images={product.images} 
                reason="Low frame rate or rendering issues detected. Standard image gallery activated." 
              />
            ) : (
              <ImageGallery images={product.images} />
            )}

            {/* 3D Model Launcher Area */}
            {product.has3dModel && !lowPerfFallback && (
              <TouchableOpacity 
                style={styles.viewerLauncher}
                activeOpacity={0.8}
                onPress={() => setView3d(true)}
              >
                <View style={styles.launcherIconWrapper}>
                  <Rotate3d color="#FFFFFF" size={28} />
                </View>
                <View style={styles.launcherInfo}>
                  <Text style={styles.launcherTitle}>View in 3D Space</Text>
                  <Text style={styles.launcherSubtitle}>Drag to rotate and pinch to zoom details</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Product Details Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>{product.category}</Text>
            <Text style={styles.stockText}>
              {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
            </Text>
          </View>

          <Text style={styles.productTitle}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
            {product.compareAtPrice && (
              <Text style={styles.comparePriceText}>${product.compareAtPrice.toFixed(2)}</Text>
            )}
          </View>

          <Text style={styles.descriptionHeader}>Product Overview</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Floating Action Button Bar */}
      <View style={styles.bottomBar}>
        <Button
          title={isAdding ? 'Adding...' : 'Add to Cart'}
          onPress={handleAddToCart}
          isLoading={isAdding}
          disabled={product.stockQuantity <= 0}
          style={styles.addToCartBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  errorBtn: {
    width: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  viewerLauncher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E24',
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    ...THEME.shadows.sm,
  },
  launcherIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  launcherInfo: {
    flex: 1,
  },
  launcherTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  launcherSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  infoCard: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stockText: {
    color: THEME.colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  productTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 10,
  },
  comparePriceText: {
    color: THEME.colors.textSecondary,
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  descriptionHeader: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  descriptionText: {
    color: THEME.colors.textLight,
    fontSize: 14,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121214',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  addToCartBtn: {
    width: '100%',
  },
  viewerContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
    width: '100%',
  },
  galleryToggleBtn: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.md,
    marginTop: 10,
  },
  galleryToggleBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
