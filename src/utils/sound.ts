// Sound Utility using Web Audio API

let audioContext: AudioContext | null = null;
let isMuted = false;

const getAudioContext = () => {
    if (!audioContext && typeof window !== 'undefined') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};

export const setGlobalMute = (muted: boolean) => {
    isMuted = muted;
};

type SoundType = 'click' | 'start' | 'reset' | 'clear' | 'success' | 'step';

export const playSound = (type: SoundType, volumeOverride?: number) => {
    if (isMuted) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    // Default volume for generic playback
    let volume = 0.1;

    switch (type) {
        case 'click':
            // Lowered volume for drag/paint
            volume = 0.05;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gainNode.gain.setValueAtTime(volume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;

        case 'step':
            // Very subtle ticking sound for loop
            volume = 0.02;
            osc.type = 'triangle'; // Softer than sine sometimes for ticks, or 'sine'
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            gainNode.gain.setValueAtTime(volume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;

        case 'start':
             // Rising swipe
            volume = 0.1;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.2);
            gainNode.gain.setValueAtTime(volume, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;

        case 'reset':
            // Falling rewind sound
            volume = 0.05;
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
            gainNode.gain.setValueAtTime(volume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
        
        case 'clear':
             // Trash crunch / low thud
            volume = 0.05;
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
            gainNode.gain.setValueAtTime(volume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
             osc.start(now);
            osc.stop(now + 0.15);
            break;
            
        case 'success':
             // Major chord arpeggio
            [440, 554, 659].forEach((freq, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.type = 'sine';
                o.frequency.setValueAtTime(freq, now + i * 0.05);
                g.gain.setValueAtTime(0.05, now + i * 0.05);
                g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.3);
                o.start(now + i * 0.05);
                o.stop(now + i * 0.05 + 0.3);
            });
            break;
    }
};
