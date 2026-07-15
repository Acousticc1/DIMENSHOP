import React, { Suspense, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei/native';
import { THEME } from '../../styles/theme';
import { useFPSMonitor } from '../../../application/hooks/useDeviceCapabilities';
import { logger } from '../../../shared/utils/logger';

interface ThreeDViewerProps {
  modelUrl: string;
  fallbackImage?: string;
  onLowPerformance?: () => void;
}

function Model({ url }: { url: string }) {
  try {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={2.0} position={[0, -0.8, 0]} />;
  } catch (err) {
    logger.error('Failed to load 3D GLB model in fiber primitive', err);
    throw err;
  }
}

function PerformanceBoundary({ onLowPerformance }: { onLowPerformance?: () => void }) {
  const { isLowPerformance } = useFPSMonitor(20); // 20 FPS threshold
  
  useEffect(() => {
    if (isLowPerformance && onLowPerformance) {
      logger.warn('Triggering low performance fallback boundary');
      onLowPerformance();
    }
  }, [isLowPerformance, onLowPerformance]);

  return null;
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ modelUrl, onLowPerformance }) => {
  return (
    <View style={styles.container}>
      <Suspense 
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
            <Text style={styles.loadingText}>Loading 3D Model...</Text>
          </View>
        }
      >
        <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          
          <PerformanceBoundary onLowPerformance={onLowPerformance} />
          
          <Model url={modelUrl} />
          
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
          />
        </Canvas>
      </Suspense>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 350,
    backgroundColor: '#0F0F11',
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F0F11',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
});
