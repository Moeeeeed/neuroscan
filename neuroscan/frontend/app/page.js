'use client';

import { useState, useEffect } from 'react';
import { Brain, Stethoscope } from "lucide-react";
import PatientForm from "../components/PatientForm";
import ImageUploader from "../components/ImageUploader";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [step, setStep] = useState('splash');
  const [patientDetails, setPatientDetails] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('patient');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === 'splash') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #0b1120 0%, #050811 100%)' }}>
        <div className="heartbeat">
          <Stethoscope color="var(--accent-blue)" size={90} />
        </div>
        <h1 style={{ marginTop: '2rem', color: 'white', fontSize: '2.5rem', letterSpacing: '2px' }}>NeuroScan AI</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '1rem' }}>Advanced Diagnostic Imaging System</p>
        <div style={{ marginTop: '3rem', color: 'var(--accent-blue)' }} className="spinner"></div>
      </div>
    );
  }

  return (
    <main className="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="header">
        <div className="logo-container">
          <Brain color="white" size={28} />
        </div>
        <div>
          <h1>NeuroScan AI</h1>
          <p>Explainable Deep Learning for Brain Tumor MRI Classification</p>
        </div>
      </header>

      <section style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {step === 'patient' && (
          <PatientForm onNext={(data) => {
            setPatientDetails(data);
            setStep('upload');
          }} />
        )}
        
        {step === 'upload' && (
          <ImageUploader 
            patientDetails={patientDetails}
            onComplete={(result) => {
              setUploadResult(result);
              setStep('dashboard');
            }}
            onBack={() => setStep('patient')}
          />
        )}

        {step === 'dashboard' && (
          <Dashboard 
            result={uploadResult}
            onReset={() => {
              setUploadResult(null);
              setStep('upload');
            }}
          />
        )}
      </section>
      
      <footer style={{ marginTop: 'auto', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '2rem 0' }}>
        <p>&copy; 2026 NeuroScan Diagnostic Assistant. Track A Implementation.</p>
      </footer>
    </main>
  );
}
