"use client";

import { useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, Download, Navigation, Activity, BrainCircuit, ScanLine } from 'lucide-react';
import dynamic from 'next/dynamic';

const Brain3DView = dynamic(() => import('./Brain3DView'), { ssr: false });

export default function Dashboard({ result, onReset }) {
  const [activeTab, setActiveTab] = useState('heatmap'); // heatmap, 3d, analytical, pdf
  const [doctorNotes, setDoctorNotes] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportLink, setReportLink] = useState(null);

  if (!result) return null;

  const isTumor = result.diagnosis !== "No Tumor";

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosis: result.diagnosis,
          confidence: result.confidence,
          originalImage: result.originalImage,
          gradCamImage: result.gradCamImage,
          locationText: result.locationText,
          llmAnalysis: result.llmAnalysis,
          patientDetails: result.patientDetails,
          doctorNotes: doctorNotes
        }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const data = await response.json();
      setReportLink(data.report_url || `http://127.0.0.1:5000/reports/${data.report_id}`);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF report.");
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out', flex: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('heatmap')}
          style={{ flex: 1, padding: '1rem', background: activeTab === 'heatmap' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', border: 'none', borderBottom: activeTab === 'heatmap' ? '2px solid var(--accent-blue)' : '2px solid transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.1rem', transition: 'all 0.2s' }}
        >
          <ScanLine size={20} color={activeTab === 'heatmap' ? 'var(--accent-blue)' : 'var(--text-secondary)'} />
          XAI Heatmap
        </button>
        <button 
          onClick={() => setActiveTab('3d')}
          style={{ flex: 1, padding: '1rem', background: activeTab === '3d' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', border: 'none', borderBottom: activeTab === '3d' ? '2px solid var(--accent-blue)' : '2px solid transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.1rem', transition: 'all 0.2s' }}
        >
          <BrainCircuit size={20} color={activeTab === '3d' ? 'var(--accent-blue)' : 'var(--text-secondary)'} />
          3D Localization
        </button>
        <button 
          onClick={() => setActiveTab('analytical')}
          style={{ flex: 1, padding: '1rem', background: activeTab === 'analytical' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', border: 'none', borderBottom: activeTab === 'analytical' ? '2px solid var(--accent-blue)' : '2px solid transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.1rem', transition: 'all 0.2s' }}
        >
          <Activity size={20} color={activeTab === 'analytical' ? 'var(--accent-blue)' : 'var(--text-secondary)'} />
          Analytical View
        </button>
        <button 
          onClick={() => setActiveTab('pdf')}
          style={{ flex: 1, padding: '1rem', background: activeTab === 'pdf' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', border: 'none', borderBottom: activeTab === 'pdf' ? '2px solid var(--accent-blue)' : '2px solid transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.1rem', transition: 'all 0.2s' }}
        >
          <FileText size={20} color={activeTab === 'pdf' ? 'var(--accent-blue)' : 'var(--text-secondary)'} />
          PDF Report
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
        <div className="result-header" style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div className="diagnosis-title" style={{ fontSize: '1.5rem' }}>
              {isTumor ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger)' }}>
                  <AlertCircle size={32} />
                  {result.diagnosis} Detected
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)' }}>
                  <CheckCircle2 size={32} />
                  No Tumor Detected
                </span>
              )}
            </div>
            {isTumor && result.locationText && (
              <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={16} /> {result.locationText}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <div className="confidence-badge" style={{ color: isTumor ? 'var(--danger)' : 'var(--success)', fontSize: '1.25rem', padding: '0.5rem 1rem' }}>
              AI Confidence: {(result.confidence * 100).toFixed(2)}%
            </div>
            <button className="btn-secondary" onClick={onReset} style={{ padding: '0.5rem 1rem' }}>Upload New Scan</button>
          </div>
        </div>

        {/* TAB CONTENT */}

        {activeTab === 'heatmap' && (
          <div style={{ display: 'grid', gridTemplateColumns: isTumor ? '1fr 1fr' : '1fr', gap: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Original MRI Scan</h3>
              <img src={`data:image/jpeg;base64,${result.originalImage}`} alt="Original MRI" style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            {isTumor && (
              <div>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-blue)' }}>Grad-CAM Activation Heatmap</h3>
                <img src={`data:image/jpeg;base64,${result.gradCamImage}`} alt="Grad-CAM" style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
            )}
          </div>
        )}

        {activeTab === '3d' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {isTumor ? (
              <Brain3DView result={result} />
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
                <h3>No Anomalies Detected</h3>
                <p>3D Localization is only active when anomalous tissue is found.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytical' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>Diagnostic Analytics & RAG Interpretation</h3>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Confidence Distribution</h4>
              {/* Mock bars for UI */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>{result.diagnosis}</span>
                  <span>{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${result.confidence * 100}%`, height: '100%', background: isTumor ? 'var(--danger)' : 'var(--success)' }}></div>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>Other Classes (Combined)</span>
                  <span>{((1 - result.confidence) * 100).toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(1 - result.confidence) * 100}%`, height: '100%', background: 'var(--text-secondary)' }}></div>
                </div>
              </div>
            </div>

            {result.llmAnalysis && (
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>AI RAG Diagnostic Analysis</h4>
                <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid var(--success)', borderRadius: '4px', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                  {result.llmAnalysis}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pdf' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Physician's Diagnostic Notes</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Add additional clinical observations or surgical recommendations. These will be appended to the final PDF report.
              </p>
              <textarea 
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Type your medical notes here..."
                style={{
                  width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '8px', 
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical'
                }}
              />
            </div>

            <div className="report-section" style={{ background: 'transparent', padding: 0, border: 'none' }}>
              <button 
                className="btn-primary" 
                onClick={handleGenerateReport} 
                disabled={generatingReport || reportLink}
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              >
                <FileText size={24} />
                {generatingReport ? "Generating Secure PDF..." : "Generate Complete Diagnostic PDF Report"}
              </button>

              {reportLink && (
                <div className="short-link-box" style={{ marginTop: '1.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Secure Shareable Link Generated</p>
                    <a href={reportLink} target="_blank" rel="noopener noreferrer">{reportLink}</a>
                  </div>
                  <a href={reportLink} download className="btn-secondary" style={{ padding: '0.5rem', border: 'none' }}>
                    <Download size={20} color="var(--accent-blue)" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
