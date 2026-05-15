import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: '#6366f1' }}>
          Regina Reynolds
        </div>
        <div style={{ fontSize: 32, color: '#94a3b8', marginTop: 16 }}>
          Software Engineer &amp; 3D Artist
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
