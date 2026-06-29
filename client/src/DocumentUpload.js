import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaCheck, FaTimes } from 'react-icons/fa';
import './colors.css';
import './App.css';

function DocumentUpload({ onUpload, label = 'Upload Document' }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setUploaded(false);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    // Simulate upload - replace with actual API call
    setTimeout(() => {
      setUploaded(true);
      setUploading(false);
      if (onUpload) onUpload(file);
    }, 2000);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>
      
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? '#8a5c66' : 'var(--border-subtle)'}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: isDragActive ? 'rgba(138,92,102,0.05)' : 'transparent',
          borderColor: uploaded ? '#5cb85c' : isDragActive ? '#8a5c66' : 'var(--border-subtle)'
        }}
      >
        <input {...getInputProps()} />
        {uploaded ? (
          <div style={{ color: '#5cb85c' }}>
            <FaCheck size={24} />
            <p style={{ margin: '8px 0 0 0' }}>Uploaded successfully!</p>
          </div>
        ) : file ? (
          <div>
            <p style={{ margin: 0, color: 'var(--text-primary)' }}>{file.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
        ) : (
          <div>
            <FaUpload size={24} color="var(--text-muted)" />
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
              {isDragActive ? 'Drop file here...' : 'Drag & drop or click to upload'}
            </p>
          </div>
        )}
      </div>

      {file && !uploaded && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary"
          style={{ marginTop: '8px', width: '100%', padding: '8px' }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      )}

      {uploaded && (
        <button
          onClick={() => setFile(null)}
          className="btn-secondary"
          style={{ marginTop: '8px', width: '100%', padding: '8px', fontSize: '13px' }}
        >
          <FaTimes style={{ marginRight: '6px' }} /> Remove and upload again
        </button>
      )}
    </div>
  );
}

export default DocumentUpload;
