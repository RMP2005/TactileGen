import { useState, useEffect, useRef } from 'react';
import { TactileAudioEngine } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

export function useTactileAudio(
  nearestDistance: number,
  hoveredRegion: string | null,
  hoveredLabel: string | null,
  hapticsEnabled: boolean = true
) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioEngine = useRef<TactileAudioEngine | null>(null);
  const prevRegion = useRef<string | null>(null);
  const prevLabel = useRef<string | null>(null);

  useEffect(() => {
    if (isAudioEnabled && !audioEngine.current) {
      audioEngine.current = new TactileAudioEngine();
      audioEngine.current.init();
    } else if (!isAudioEnabled && audioEngine.current) {
      audioEngine.current.dispose();
      audioEngine.current = null;
    }
  }, [isAudioEnabled]);

  const lastLineCross = useRef<number>(0);

  useEffect(() => {
    if (!isAudioEnabled && !hapticsEnabled) return;
    
    if (isAudioEnabled && audioEngine.current) {
      // Max distance in screen pixels to start hearing sound
      audioEngine.current.updateProximity(nearestDistance, 80);
    }
    
    // Haptics logic with debouncing
    if (hapticsEnabled && nearestDistance < 8) {
      const now = Date.now();
      if (now - lastLineCross.current > 120) {
        haptics.lineCross();
        lastLineCross.current = now;
      }
    }
  }, [nearestDistance, isAudioEnabled, hapticsEnabled]);

  useEffect(() => {
    if (hoveredRegion && hoveredRegion !== prevRegion.current) {
      if (isAudioEnabled && audioEngine.current) {
        audioEngine.current.playRegionEnter();
      }
      if (hapticsEnabled) {
        haptics.regionEnter();
      }
    }
    prevRegion.current = hoveredRegion;
  }, [hoveredRegion, isAudioEnabled, hapticsEnabled]);

  useEffect(() => {
    if (hoveredLabel && hoveredLabel !== prevLabel.current) {
      if (isAudioEnabled && audioEngine.current) {
        audioEngine.current.playLabelHover();
      }
      if (hapticsEnabled) {
        haptics.labelHover();
      }
    }
    prevLabel.current = hoveredLabel;
  }, [hoveredLabel, isAudioEnabled, hapticsEnabled]);

  const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);

  return {
    isAudioEnabled,
    toggleAudio
  };
}
