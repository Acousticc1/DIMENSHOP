import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';
import { THEME } from '../../styles/theme';
import { useWishlistStore } from '../../../application/stores/useWishlistStore';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number | null;
    imageUrl: string | null;
    has3dModel: boolean;
    category?: string;
  };
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);

  const handleWishlistPress = (e: any) => {
    e.stopPropagation();
    toggleWishlist(product.id, {
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      has3dModel: product.has3dModel,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        
        {/* 3D Indicator Badge */}
        {product.has3dModel && (
          <View style={styles.badge3d}>
            <Text style={styles.badge3dText}>3D VIEW</Text>
          </View>
        )}

        {/* Favorite Heart Button */}
        <TouchableOpacity style={styles.heartButton} onPress={handleWishlistPress} activeOpacity={0.7}>
          <Heart 
            size={18} 
            color={isFavorite ? '#FF453A' : '#E5E5EA'} 
            fill={isFavorite ? '#FF453A' : 'transparent'} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {product.category && <Text style={styles.category}>{product.category}</Text>}
        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.compareAtPrice && (
            <Text style={styles.comparePrice}>${product.compareAtPrice.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
    marginBottom: 16,
    width: '47%', // Double column layout support
    ...THEME.shadows.sm,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#1E1E22',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  badge3d: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  badge3dText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heartButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(15, 15, 17, 0.6)',
    padding: 6,
    borderRadius: THEME.borderRadius.round,
  },
  infoContainer: {
    padding: 12,
  },
  category: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  comparePrice: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
});
