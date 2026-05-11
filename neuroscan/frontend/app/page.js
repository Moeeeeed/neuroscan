"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Stethoscope,
  ArrowRight,
  Shield,
  Zap,
  FileText,
  Activity,
  ChevronDown,
} from "lucide-react";
import PatientForm from "../components/PatientForm";
import ImageUploader from "../components/ImageUploader";
import Dashboard from "../components/Dashboard";

/* ── Animation helpers ── */
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

/* ── Feature cards data ── */
const features = [
  {
    icon: <Brain size={28} />,
    title: "Deep Learning Engine",
    desc: "ResNet50-based classifier trained on thousands of MRI scans with 95%+ accuracy across four diagnostic classes.",
  },
  {
    icon: <Activity size={28} />,
    title: "Grad-CAM Visualization",
    desc: "Explainable AI heatmaps that highlight tumor regions, giving clinicians visual evidence for every prediction.",
  },
  {
    icon: <FileText size={28} />,
    title: "AI-Generated Reports",
    desc: "Automated PDF reports with patient details, diagnosis, confidence scores, and clinical notes — ready to share.",
  },
  {
    icon: <Shield size={28} />,
    title: "HIPAA-Ready Design",
    desc: "Built with privacy-first architecture. All data processed locally with secure report generation and sharing.",
  },
  {
    icon: <Zap size={28} />,
    title: "Real-Time Inference",
    desc: "Sub-second predictions on GPU-accelerated infrastructure. Upload an MRI and get results instantly.",
  },
  {
    icon: <Stethoscope size={28} />,
    title: "Clinical Workflow",
    desc: "Designed for radiologists and neurologists. Simple three-step flow: patient info → upload → diagnosis.",
  },
];

/* ── Steps data ── */
const steps = [
  { num: "01", title: "Enter Patient Details", desc: "Fill in patient name, age, and relevant history." },
  { num: "02", title: "Upload MRI Scan", desc: "Drag & drop or select a brain MRI image (JPG/PNG)." },
  { num: "03", title: "Get Instant Diagnosis", desc: "Receive classification, Grad-CAM heatmap, and AI report." },
];

export default function Home() {
  const [step, setStep] = useState("splash");
  const [patientDetails, setPatientDetails] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => setStep("landing"), 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  /* ── Splash Screen ── */
  if (step === "splash") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="splash-screen"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="heartbeat">
            <Stethoscope color="var(--accent-blue)" size={90} />
          </div>
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="splash-title"
        >
          NeuroScan AI
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="splash-sub"
        >
          Advanced Diagnostic Imaging System
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="spinner"
          style={{ marginTop: "3rem", color: "var(--accent-blue)" }}
        />
      </motion.div>
    );
  }

  /* ── Landing Page ── */
  if (step === "landing") {
    return (
      <>
        {/* ─── HERO ─── */}
        <section className="hero-section">
          <div className="hero-bg-glow" />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-content"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="hero-badge"
            >
              <Zap size={14} />
              <span>AI-Powered Diagnostics</span>
            </motion.div>

            <h1 className="hero-title">
              Detect Brain Tumors with{" "}
              <span className="gradient-text">Explainable AI</span>
            </h1>

            <p className="hero-desc">
              Upload an MRI scan and receive an instant, AI-driven diagnosis
              with Grad-CAM visualizations and comprehensive clinical reports.
              Built for radiologists, by researchers.
            </p>

            <div className="hero-actions">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary hero-btn"
                onClick={() => setStep("patient")}
              >
                Start Diagnosis <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary hero-btn-secondary"
                onClick={() => {
                  const el = document.getElementById("features");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="hero-scroll"
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </section>

        {/* ─── FEATURES ─── */}
        <section id="features" className="section">
          <motion.div {...fadeUp} className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Why NeuroScan?</h2>
            <p className="section-desc">
              Combining state-of-the-art deep learning with clinical-grade
              explainability.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...stagger}
                transition={{ ...stagger.transition, delay: i * 0.08 }}
                className="feature-card"
              >
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="section section-alt">
          <motion.div {...fadeUp} className="section-header">
            <span className="section-badge">Workflow</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">
              Three simple steps from MRI upload to clinical report.
            </p>
          </motion.div>

          <div className="steps-row">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="step-card"
              >
                <span className="step-num">{s.num}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="step-connector">
                    <ArrowRight size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            style={{ textAlign: "center", marginTop: "3rem" }}
          >
            <button
              className="btn-primary"
              onClick={() => setStep("patient")}
            >
              Get Started <ArrowRight size={18} />
            </button>
          </motion.div>
        </section>

        {/* ─── STATS ─── */}
        <section className="section">
          <div className="stats-row">
            {[
              { label: "MRI Scans Analyzed", value: "10K+" },
              { label: "Classification Accuracy", value: "95%" },
              { label: "Supported Classes", value: "4" },
              { label: "Avg. Inference Time", value: "<1s" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="stat-card"
              >
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="section cta-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-card"
          >
            <h2 className="cta-title">Ready to Transform Your Diagnostics?</h2>
            <p className="cta-desc">
              Experience the power of explainable AI in brain tumor
              classification. No setup required.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary cta-btn"
              onClick={() => setStep("patient")}
            >
              Start Diagnosis Now <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </section>
      </>
    );
  }

  /* ─── DIAGNOSTIC FLOW ─── */
  return (
    <div className="diagnostic-flow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="diagnostic-header"
      >
        <button className="btn-back" onClick={() => setStep("landing")}>
          ← Back to Home
        </button>
        <h2>
          {step === "patient"
            ? "Patient Information"
            : step === "upload"
              ? "Upload MRI Scan"
              : "Diagnostic Dashboard"}
        </h2>
      </motion.div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {step === "patient" && (
          <PatientForm
            onNext={(data) => {
              setPatientDetails(data);
              setStep("upload");
            }}
          />
        )}

        {step === "upload" && (
          <ImageUploader
            patientDetails={patientDetails}
            onComplete={(result) => {
              setUploadResult(result);
              setStep("dashboard");
            }}
            onBack={() => setStep("patient")}
          />
        )}

        {step === "dashboard" && (
          <Dashboard
            result={uploadResult}
            onReset={() => {
              setUploadResult(null);
              setStep("upload");
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
