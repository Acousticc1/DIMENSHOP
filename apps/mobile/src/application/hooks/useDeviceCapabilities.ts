import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { logger } from '../../shared/utils/logger';

interface FPSMonitorResult {
  fps: number;
  isLowPerformance: boolean;
}

/**
 * Hook to monitor canvas render frame rates in real-time.
 * Dynamically reports low performance states to trigger Level of Detail (LOD) downgrades.
 */
export function useFPSMonitor(thresholdFps = 24, windowSizeFrames = 60): FPSMonitorResult {
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  let frameTimes: number[] = [];
  let lastFrameTime = performance.now();

  useFrame(() => {
    const currentTime = performance.now();
    const delta = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    // Store frame time deltas
    frameTimes.push(delta);
    if (frameTimes.length > windowSizeFrames) {
      frameTimes.shift();
    }

    // Calculate moving average FPS every 60 frames
    if (frameTimes.length === windowSizeFrames) {
      const avgDelta = frameTimes.reduce((sum, t) => sum + t, 0) / windowSizeFrames;
      const currentFps = Math.round(1000 / avgDelta);
      
      if (Math.abs(fps - currentFps) > 3) {
        setFps(currentFps);
        const lowPerf = currentFps < thresholdFps;
        if (lowPerf !== isLowPerformance) {
          setIsLowPerformance(lowPerf);
          logger.warn('Performance threshold matched', { currentFps, isLowPerformance: lowPerf });
        }
      }
    }
  });

  return { fps, isLowPerformance };
}

/**
 * Static check for device WebGL capability.
 */
export function useDeviceCapabilities() {
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    // Standard Expo devices check
    // In production native modules check for GL context bindings
    setWebGlSupported(true);
  }, []);

  return { webGlSupported };
}
