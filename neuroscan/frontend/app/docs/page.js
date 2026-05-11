"use client";

import { motion } from "framer-motion";
import {
    BookOpen,
    Code,
    FileJson,
    Cpu,
    Shield,
    Terminal,
} from "lucide-react";

const sections = [
    {
        icon: <Cpu size={24} />,
        title: "Model Architecture",
        desc: "NeuroScan uses a ResNet50 backbone pre-trained on ImageNet, followed by GlobalAveragePooling2D, a Dense(256) layer, Dropout(0.5), and a softmax output layer with 4 classes.",
        code: `Base: ResNet50 (ImageNet weights)
Top: GAP → Dense(256, ReLU) → Dropout(0.5) → Dense(4, Softmax)`,
    },
    {
        icon: <FileJson size={24} />,
        title: "API Endpoints",
        desc: "The Flask backend exposes two primary endpoints for prediction and report generation.",
        code: `POST /predict
  Body: multipart/form-data
    - file: MRI image (JPG/PNG)
    - patientDetails: JSON string
  Response: { diagnosis, confidence,
              gradCamImage, originalImage,
              locationText, llmAnalysis }

POST /generate-report
  Body: application/json
    - diagnosis, confidence, originalImage,
      gradCamImage, locationText, doctorNotes
  Response: { report_id, report_url }`,
    },
    {
        icon: <Terminal size={24} />,
        title: "Supported Classes",
        desc: "The model classifies brain MRI scans into four categories.",
        code: `0 — Glioma
1 — Meningioma
2 — No Tumor
3 — Pituitary Tumor`,
    },
    {
        icon: <Shield size={24} />,
        title: "Grad-CAM Explainability",
        desc: "Grad-CAM (Gradient-weighted Class Activation Mapping) produces a coarse localization heatmap highlighting the regions the model focused on for its prediction.",
        code: `Layer: conv5_block3_out (ResNet50)
Method: Gradient-weighted Class Activation
Output: Overlay heatmap on original MRI`,
    },
    {
        icon: <Code size={24} />,
        title: "Tech Stack",
        desc: "Built with modern, production-grade technologies.",
        code: `Frontend: Next.js 14, React 18, Framer Motion
Backend:  Flask 3.0, TensorFlow 2.16
Model:   ResNet50, Keras
PDF:     WeasyPrint, Jinja2
AI:      Grok API (RAG-based analysis)`,
    },
    {
        icon: <BookOpen size={24} />,
        title: "Getting Started",
        desc: "Clone the repository, install dependencies, and run both servers.",
        code: `# Backend
cd neuroscan/backend
pip install -r requirements.txt
python app.py

# Frontend
cd neuroscan/frontend
npm install
npm run dev`,
    },
];

export default function DocsPage() {
    return (
        <div className="page-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="page-header"
            >
                <span className="section-badge">Documentation</span>
                <h1 className="page-title">Technical Docs</h1>
                <p className="page-desc">
                    Comprehensive guide to the NeuroScan architecture, API, and usage.
                </p>
            </motion.div>

            <div className="docs-grid">
                {sections.map((s, i) => (
                    <motion.div
                        key={s.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className="doc-card"
                    >
                        <div className="doc-card-header">
                            <div className="doc-card-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                        </div>
                        <p className="doc-card-desc">{s.desc}</p>
                        <pre className="doc-card-code">
                            <code>{s.code}</code>
                        </pre>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
