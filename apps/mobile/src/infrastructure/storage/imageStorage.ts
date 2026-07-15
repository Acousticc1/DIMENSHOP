import { supabase } from '../supabase/client';
import { logger } from '../../shared/utils/logger';

export const uploadProductImage = async (productId: string, fileUri: string): Promise<string> => {
  try {
    logger.info('Uploading image from local file URI', { productId, fileUri });
    
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    // Generate a unique filename nested in the product's ID folder
    const fileName = `${productId}/${Date.now()}_${Math.random().toString(36).substr(2, 5)}.jpg`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    logger.info('Upload complete, file public URL generated', { publicUrl });
    return publicUrl;
  } catch (err) {
    logger.error('Failed to upload image file to storage bucket', err);
    throw err;
  }
};
