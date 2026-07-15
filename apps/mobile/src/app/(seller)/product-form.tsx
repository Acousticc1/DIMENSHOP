import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { THEME } from '../../styles/theme';
import { useSellerStore } from '../../application/stores/useSellerStore';
import { MOCK_CATEGORIES } from '../../shared/constants/mockData';
import { Button } from '../../presentation/components/ui/Button';
import { Input } from '../../presentation/components/ui/Input';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { logger } from '../../shared/utils/logger';

const productSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess((val) => Number(val), z.number().positive('Price must be greater than 0')),
  stockQuantity: z.preprocess((val) => Number(val), z.number().int().nonnegative('Stock cannot be negative')),
  categoryId: z.string().min(1, 'Please select a category'),
});

type ProductFormInput = z.infer<typeof productSchema>;

export default function ProductForm() {
  const router = useRouter();
  const { createProduct, isLoading, error } = useSellerStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      stockQuantity: 5,
      categoryId: '',
    },
  });

  const selectedCategoryId = watch('categoryId');

  const onSubmit = async (data: ProductFormInput) => {
    try {
      logger.info('Submitting new product form', data);
      const product = await createProduct(data);
      logger.info('Product created draft successfully', { id: product.id });
      
      // Redirect to image upload page
      router.replace({
        pathname: '/(seller)/image-upload',
        params: { productId: product.id },
      });
    } catch (err) {
      logger.error('Failed to create product draft', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.formCard}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Product Title"
                  placeholder="e.g. Classic Wooden Chair"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Description"
                  placeholder="Detail the materials, design, and dimensions..."
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.description?.message}
                />
              )}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Controller
                  control={control}
                  name="price"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Price ($)"
                      placeholder="120.00"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ? value.toString() : ''}
                      error={errors.price?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.col}>
                <Controller
                  control={control}
                  name="stockQuantity"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Stock Qty"
                      placeholder="5"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ? value.toString() : ''}
                      error={errors.stockQuantity?.message}
                    />
                  )}
                />
              </View>
            </View>

            {/* Category Select Chips */}
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>Select Category</Text>
              <View style={styles.chipsWrapper}>
                {MOCK_CATEGORIES.filter(c => c.id !== 'all').map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.chip,
                      selectedCategoryId === category.id ? styles.chipActive : null,
                    ]}
                    onPress={() => setValue('categoryId', category.id)}
                  >
                    <Text style={[
                      styles.chipText,
                      selectedCategoryId === category.id ? styles.chipTextActive : null,
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.categoryId?.message && (
                <Text style={styles.categoryError}>{errors.categoryId.message}</Text>
              )}
            </View>

            <Button
              title="Save & Proceed"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              style={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  formCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    width: '48%',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E5EA',
    marginBottom: 10,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.round,
    margin: 4,
  },
  chipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  chipText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryError: {
    color: '#FF453A',
    fontSize: 12,
    marginTop: 6,
  },
  submitBtn: {
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.3)',
  },
  errorText: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
