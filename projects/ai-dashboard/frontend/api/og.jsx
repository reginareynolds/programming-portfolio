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
          AI Dashboard
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', marginTop: 16 }}>
          Ask questions about your data in plain English
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 48,
            padding: '16px 32px',
            background: '#1e293b',
            borderRadius: 8,
            border: '1px solid #334155',
          }}
        >
          <div style={{ fontSize: 20, color: '#94a3b8' }}>
            What is the total revenue by region?
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'white',
              background: '#6366f1',
              padding: '8px 20px',
              borderRadius: 8,
            }}
          >
            Query
          </div>
        </div>
        <div style={{ fontSize: 16, color: '#64748b', marginTop: 32 }}>
          Regina Reynolds — React · Flask · PostgreSQL · LangChain
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
