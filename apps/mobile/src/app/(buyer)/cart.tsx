import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react-native';
import { THEME } from '../../styles/theme';
import { useCartStore } from '../../application/stores/useCartStore';
import { Button } from '../../presentation/components/ui/Button';

export default function BuyerCart() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();

  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={64} color={THEME.colors.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.emptyTextTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptyTextSub}>Browse products and add them to your cart to checkout.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {items.map(item => (
          <View key={item.id} style={styles.cartCard}>
            {item.product.imageUrl ? (
              <Image source={{ uri: item.product.imageUrl }} style={styles.productImage} />
            ) : (
              <View style={styles.placeholderImage} />
            )}

            <View style={styles.infoContainer}>
              <Text style={styles.title} numberOfLines={1}>{item.product.title}</Text>
              <Text style={styles.price}>${item.product.price.toFixed(2)}</Text>

              {/* Quantity Selector Controls */}
              <View style={styles.controlsRow}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityBtn} 
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityBtn} 
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                  <Trash2 size={16} color={THEME.colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Pricing Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>FREE</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <Button 
            title="Proceed to Checkout" 
            style={styles.checkoutBtn} 
            onPress={() => alert('Checkout flow starts in Phase 7/8')}
          />
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
  cartCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: THEME.borderRadius.md,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: '#1E1E22',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  price: {
    color: THEME.colors.textLight,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 2,
  },
  quantityBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  removeBtn: {
    padding: 6,
  },
  summaryCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginTop: 16,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  checkoutBtn: {
    marginTop: 16,
  },
});
