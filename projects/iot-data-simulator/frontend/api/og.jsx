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
          padding: 60,
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, color: '#818cf8' }}>
          IoT Data Simulator
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', marginTop: 16 }}>
          Real-time factory sensor monitoring with live WebSocket feeds
        </div>
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 48,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 28px',
              background: '#1e293b',
              borderRadius: 8,
              border: '1px solid #334155',
            }}
          >
            <div style={{ fontSize: 14, color: '#94a3b8', textTransform: 'uppercase' }}>Temperature</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9' }}>72.4°C</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 28px',
              background: '#1e293b',
              borderRadius: 8,
              border: '1px solid #334155',
            }}
          >
            <div style={{ fontSize: 14, color: '#94a3b8', textTransform: 'uppercase' }}>Pressure</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9' }}>2.1 bar</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 28px',
              background: '#1e293b',
              borderRadius: 8,
              border: '1px solid #334155',
            }}
          >
            <div style={{ fontSize: 14, color: '#94a3b8', textTransform: 'uppercase' }}>OEE</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>87.2%</div>
          </div>
        </div>
        <div style={{ fontSize: 16, color: '#64748b', marginTop: 32 }}>
          Regina Reynolds — React · Flask · WebSocket · PostgreSQL
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
