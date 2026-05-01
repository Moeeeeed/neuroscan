"use client";

import { useState, useRef } from "react";
import { Upload, Brain, AlertCircle, ArrowLeft } from "lucide-react";

export default function ImageUploader({ patientDetails, onComplete, onBack }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      resetAll();
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      resetAll();
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (patientDetails) {
      formData.append("patientDetails", JSON.stringify(patientDetails));
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to get prediction from server");

      const data = await response.json();
      onComplete(data); // Pass to Dashboard
    } catch (err) {
      console.error(err);
      setError("Error connecting to the backend. Is Flask running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploader-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Patient Details
      </button>

      {!previewUrl ? (
        <div 
          className="upload-zone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="upload-icon" />
          <h3>Drag & Drop MRI scan here</h3>
          <p style={{ color: 'var(--text-secondary)' }}>or click to browse files (JPEG, PNG)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
      ) : (
        <div className="analysis-container">
          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Scan Ready for Analysis</h3>
              <button className="btn-secondary" onClick={resetAll} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Cancel
              </button>
            </div>
            
            <div className="image-preview-container" style={{ marginBottom: '2rem' }}>
              <img src={previewUrl} alt="Original MRI" style={{ width: '100%', borderRadius: '8px' }} />
            </div>

            {!loading ? (
              <button className="btn-primary" onClick={handlePredict} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                <Brain size={24} />
                Run AI Diagnosis
              </button>
            ) : (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--accent-blue)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px' }}>
                <div className="spinner"></div>
                <p style={{ fontWeight: 'bold' }}>Analyzing Scan with ResNet50...</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Generating Grad-CAM Heatmap & RAG LLM Analysis</p>
              </div>
            )}

            {error && (
              <div className="results-card danger" style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
                  <AlertCircle />
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
