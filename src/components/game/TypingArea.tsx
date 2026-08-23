import React, { useRef, useEffect } from 'react';

export default function TypingArea({ targetText, typedText, status, onInput }: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div style={{ position: 'relative', background: 'white', padding: '20px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '24px', fontFamily: 'monospace' }} onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={(e) => onInput(e.target.value)}
        disabled={status === 'finished'}
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
    </div>
  );
}
