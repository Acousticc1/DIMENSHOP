import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { THEME } from '../../styles/theme';
import { ImageGallery } from '../product/ImageGallery';

interface ViewerFallbackProps {
  images: string[];
  reason?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ViewerFallback: React.FC<ViewerFallbackProps> = ({ 
  images, 
  reason = '3D mesh is loading or device does not support GL acceleration.' 
}) => {
  return (
    <View style={styles.container}>
      {/* Alert Warning Box */}
      <View style={styles.alertBox}>
        <AlertCircle color={THEME.colors.warning} size={20} style={styles.icon} />
        <Text style={styles.alertText}>{reason}</Text>
      </View>

      {/* Fallback Image Catalog */}
      <ImageGallery images={images} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.3)',
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  alertText: {
    color: THEME.colors.warning,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
});
