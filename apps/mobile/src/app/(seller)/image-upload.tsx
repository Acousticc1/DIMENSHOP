import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Trash2, ChevronLeft, UploadCloud } from 'lucide-react-native';
import { THEME } from '../../styles/theme';
import { Button } from '../../presentation/components/ui/Button';
import { uploadProductImage } from '../../infrastructure/storage/imageStorage';
import { supabase } from '../../infrastructure/supabase/client';
import { logger } from '../../shared/utils/logger';

export default function ImageUpload() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to select product photos.');
      return false;
    }
    return true;
  };

  const handleSelectImages = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const uris = result.assets.map(asset => asset.uri);
        setImages([...images, ...uris]);
      }
    } catch (err) {
      logger.error('Failed to select images', err);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleStartProcessing = async () => {
    if (images.length < 5) {
      alert('COLMAP reconstruction requires at least 5 images. Please upload more for accurate 3D meshing.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      logger.info('Starting image upload and 3D processing trigger', { productId, imageCount: images.length });
      
      const uploadedUrls: string[] = [];
      
      // Upload images sequentially, updating progress indicator
      for (let i = 0; i < images.length; i++) {
        const url = await uploadProductImage(productId, images[i]);
        uploadedUrls.push(url);
        setUploadProgress(Math.round(((i + 1) / images.length) * 100));
        
        // Write the product image record to database
        await supabase.from('product_images').insert({
          product_id: productId,
          image_url: url,
          sort_order: i,
          is_primary: i === 0,
        });
      }

      // Update product status to 'processing'
      await supabase.from('products').update({
        status: 'processing',
      }).eq('id', productId);

      // Insert 3D job record (triggers Python FastAPI backend queue)
      await supabase.from('processing_jobs').insert({
        product_id: productId,
        seller_id: (await supabase.auth.getUser()).data.user?.id,
        status: 'queued',
        progress: 0,
      });

      logger.info('Upload complete, job registered successfully');
      router.replace('/(seller)/products');
    } catch (err) {
      logger.error('Error during image upload / pipeline trigger', err);
      alert('An error occurred during upload. Please check connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Product Photos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Helper Note */}
        <View style={styles.helperCard}>
          <UploadCloud color={THEME.colors.primary} size={24} style={styles.helperIcon} />
          <View style={styles.helperTextWrapper}>
            <Text style={styles.helperTitle}>3D Photogrammetry Guidelines</Text>
            <Text style={styles.helperText}>
              Upload between **5 and 30 photos** of the item. Walk in a circle around the object, capturing different angles and heights for the best COLMAP reconstruction.
            </Text>
          </View>
        </View>

        {/* Selected Images Grid */}
        {images.length === 0 ? (
          <TouchableOpacity style={styles.dropZone} onPress={handleSelectImages}>
            <ImageIcon color={THEME.colors.textSecondary} size={48} style={{ marginBottom: 12 }} />
            <Text style={styles.dropZoneTitle}>Select Product Photos</Text>
            <Text style={styles.dropZoneSub}>Choose files from your library</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.grid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.gridImage} />
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveImage(index)}>
                  <Trash2 color="#FFFFFF" size={14} />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Inline add button in grid */}
            <TouchableOpacity style={styles.gridAddCard} onPress={handleSelectImages}>
              <Plus color={THEME.colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>
        )}

        {/* Uploading Status overlay details */}
        {isUploading && (
          <View style={styles.progressCard}>
            <ActivityIndicator size="small" color={THEME.colors.primary} style={{ marginRight: 12 }} />
            <Text style={styles.progressText}>Uploading assets... {uploadProgress}%</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <Button
          title={isUploading ? `Uploading (${uploadProgress}%)` : 'Start 3D Mesh Generation'}
          onPress={handleStartProcessing}
          disabled={images.length < 5 || isUploading}
          isLoading={isUploading}
          style={styles.submitBtn}
        />
      </View>
    </SafeAreaView>
  );
}

// Add Plus icon since we use it in the grid add card
const Plus = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size, fontWeight: 'bold' }}>+</Text>
);

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
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  helperCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E24',
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: 24,
  },
  helperIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  helperTextWrapper: {
    flex: 1,
  },
  helperTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  helperText: {
    color: THEME.colors.textLight,
    fontSize: 12,
    lineHeight: 18,
  },
  dropZone: {
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
  },
  dropZoneTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  dropZoneSub: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  imageWrapper: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.6%',
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: 'rgba(255, 69, 58, 0.8)',
    padding: 6,
    borderRadius: THEME.borderRadius.round,
  },
  gridAddCard: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.6%',
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginTop: 24,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
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
  submitBtn: {
    width: '100%',
  },
});
