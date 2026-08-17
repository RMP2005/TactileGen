export class TactileAudioEngine {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;

  public init() {
    if (this.isInitialized) return;
    
    // Create audio context on user gesture
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    this.oscillator = this.ctx.createOscillator();
    this.gainNode = this.ctx.createGain();
    
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = 220; // Base frequency
    
    this.gainNode.gain.value = 0; // Start silent
    
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    
    this.oscillator.start();
    this.isInitialized = true;
  }

  public updateProximity(distance: number, maxDistance: number = 100) {
    if (!this.isInitialized || !this.ctx || !this.gainNode || !this.oscillator) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (distance > maxDistance) {
      // Fade out
      this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      return;
    }

    // Map distance to volume (closer = louder, up to 0.5 max volume)
    const normalizedDistance = Math.max(0, Math.min(1, distance / maxDistance));
    const volume = 0.5 * (1 - normalizedDistance);
    
    // Map distance to frequency (closer = higher pitch, 220Hz to 880Hz)
    const freq = 220 + (1 - normalizedDistance) * 660;
    
    this.gainNode.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
    this.oscillator.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
  }

  public playRegionEnter() {
    this.playTone(330, 0.1, 0.1);
  }

  public playLabelHover() {
    this.playTone(660, 0.1, 0.15);
  }

  private playTone(frequency: number, volume: number, duration: number) {
    if (!this.isInitialized || !this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public dispose() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    if (this.ctx) {
      this.ctx.close();
    }
    this.isInitialized = false;
  }
}
