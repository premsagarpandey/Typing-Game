import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function TypingArea({ targetText, typedText, status, shakeTrigger, onInput }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (shakeTrigger > 0) {
      controls.start({
        x: [0, -8, 8, -6, 6, -4, 4, 0],
        transition: { duration: 0.3 }
      });
    }
  }, [shakeTrigger, controls]);


  useEffect(() => {
    if (status === 'idle' || status === 'playing') {
      // Small timeout ensures modal unmounts before focusing
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [status]);

  return (
    <motion.div 
      animate={controls}
      style={{ position: 'relative', background: 'white', padding: '20px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '24px', fontFamily: 'monospace', cursor: 'text' }} 
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={(e) => onInput(e.target.value)}
        disabled={status !== 'idle' && status !== 'playing'}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
      />
      <div>
        {targetText.split('').map((char: string, index: number) => {
          let color = 'black';
          if (index < typedText.length) {
            color = typedText[index] === char ? 'green' : 'red';
          }
          const isCurrent = index === typedText.length;

          return (
            <span key={index} style={{ color: color, textDecoration: isCurrent ? 'underline' : 'none', backgroundColor: color === 'red' ? '#fca5a5' : 'transparent' }}>
              {char}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}
