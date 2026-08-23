import React from 'react';

export default function Stats() {
  return (
    <div>
      <h2>Your Statistics</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#e5e7eb' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Day</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>WPM</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={{ padding: '10px', border: '1px solid #ccc' }}>Mon</td><td style={{ padding: '10px', border: '1px solid #ccc' }}>45</td><td style={{ padding: '10px', border: '1px solid #ccc' }}>90%</td></tr>
          <tr><td style={{ padding: '10px', border: '1px solid #ccc' }}>Tue</td><td style={{ padding: '10px', border: '1px solid #ccc' }}>52</td><td style={{ padding: '10px', border: '1px solid #ccc' }}>92%</td></tr>
          <tr><td style={{ padding: '10px', border: '1px solid #ccc' }}>Wed</td><td style={{ padding: '10px', border: '1px solid #ccc' }}>48</td><td style={{ padding: '10px', border: '1px solid #ccc' }}>88%</td></tr>
        </tbody>
      </table>
    </div>
  );
}
