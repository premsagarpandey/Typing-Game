import React from 'react';

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export default function VirtualKeyboard({ nextChar }: any) {
  const targetKey = nextChar?.toLowerCase();

  return (
    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
      {ROWS.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: '5px' }}>
          {row.map(key => (
            <div
              key={key}
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #ccc',
                background: targetKey === key ? 'lightblue' : '#f9f9f9',
                borderRadius: '3px'
              }}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
      <div
        style={{
          width: '200px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ccc',
          background: targetKey === ' ' ? 'lightblue' : '#f9f9f9',
          borderRadius: '3px'
        }}
      >
        Space
      </div>
    </div>
  );
}
