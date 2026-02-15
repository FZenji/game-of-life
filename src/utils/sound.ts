// Sound Utility using Web Audio API

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
    if (!audioContext && typeof window !== 'undefined') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};

type SoundType = 'click' | 'start' | 'reset' | 'clear' | 'success';

export const playSound = (type: SoundType) => {
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

    switch (type) {
        case 'click':
            // Short high blip
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;

        case 'start':
             // Rising swipe
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.2);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;

        case 'reset':
            // Falling rewind sound
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
        
        case 'clear':
             // Trash crunch / low thud
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
            gainNode.gain.setValueAtTime(0.05, now);
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
