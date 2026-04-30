import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadCSV } from "../api";

export default function FileUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        const result = await uploadCSV(file);
        onUploadComplete(result);
      } catch (err) {
        setError(err.response?.data?.error || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="upload-section">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""} ${uploading ? "uploading" : ""}`}>
        <input {...getInputProps()} />
        {uploading ? (
          <p>Processing...</p>
        ) : isDragActive ? (
          <p>Drop your CSV here</p>
        ) : (
          <p>Drag & drop a CSV file here, or click to browse</p>
        )}
      </div>
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
}
