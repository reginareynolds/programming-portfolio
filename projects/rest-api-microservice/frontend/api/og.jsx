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
          Task Manager
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', marginTop: 16 }}>
          Kanban-style project management with JWT authentication
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 48,
          }}
        >
          <div
            style={{
              padding: '12px 24px',
              background: '#1e293b',
              borderRadius: 8,
              border: '1px solid #334155',
              fontSize: 16,
              color: '#94a3b8',
            }}
          >
            Todo
          </div>
          <div
            style={{
              padding: '12px 24px',
              background: '#1e293b',
              borderRadius: 8,
              border: '1px solid #6366f1',
              fontSize: 16,
              color: '#818cf8',
            }}
          >
            In Progress
          </div>
          <div
            style={{
              padding: '12px 24px',
              background: '#1e293b',
              borderRadius: 8,
              border: '1px solid #334155',
              fontSize: 16,
              color: '#10b981',
            }}
          >
            Done
          </div>
        </div>
        <div style={{ fontSize: 16, color: '#64748b', marginTop: 32 }}>
          Regina Reynolds — React · Flask · PostgreSQL · JWT · REST API
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
