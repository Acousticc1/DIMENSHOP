import React, { useState } from 'react';
import { StyleSheet, View, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { THEME } from '../../styles/theme';

interface ImageGalleryProps {
  images: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image 
          source={require('../../../../assets/icon.png')} 
          style={styles.logoPlaceholder} 
          resizeMode="contain" 
        />
      </View>
    );
  }

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
        )}
      />

      {/* Slide Indicators */}
      {images.length > 1 && (
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
      )}

      {/* Small Thumbnails at the bottom */}
      {images.length > 1 && (
        <View style={styles.thumbnailRow}>
          {images.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={[
                styles.thumbnailWrapper,
                activeIndex === index ? styles.activeThumbnail : null,
              ]}
            >
              <Image source={{ uri: item }} style={styles.thumbnail} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  emptyContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    backgroundColor: '#1E1E22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: 320,
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: THEME.colors.primary,
    width: 14,
  },
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: THEME.colors.background,
    width: '100%',
  },
  thumbnailWrapper: {
    width: 48,
    height: 48,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: THEME.colors.primary,
    borderWidth: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});
