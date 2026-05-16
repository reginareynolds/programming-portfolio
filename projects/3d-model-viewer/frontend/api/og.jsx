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
          3D Model Viewer
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', marginTop: 16 }}>
          Upload, view, and annotate 3D models in the browser
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 48,
            padding: '20px 36px',
            background: '#1e293b',
            borderRadius: 8,
            border: '1px solid #334155',
          }}
        >
          <div style={{ fontSize: 18, color: '#94a3b8' }}>
            Supports GLB · GLTF · OBJ · FBX
          </div>
        </div>
        <div style={{ fontSize: 16, color: '#64748b', marginTop: 32 }}>
          Regina Reynolds — React · Three.js · React Three Fiber · Flask
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
