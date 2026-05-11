"use client";

import { motion } from "framer-motion";
import {
    UserPlus,
    Upload,
    Activity,
    FileText,
    Download,
    RefreshCw,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

const steps = [
    {
        icon: <UserPlus size={28} />,
        title: "1. Enter Patient Details",
        desc: "Fill in the patient's name, age, and any relevant clinical notes. This information will be included in the generated report.",
        tip: "Accurate patient data ensures your PDF reports are ready for medical records.",
    },
    {
        icon: <Upload size={28} />,
        title: "2. Upload an MRI Scan",
        desc: "Drag & drop or click to select a brain MRI image. Supported formats: JPG, PNG. The image will be resized to 224×224 for the model.",
        tip: "For best results, use axial T2-weighted or FLAIR MRI sequences.",
    },
    {
        icon: <Activity size={28} />,
        title: "3. Review the Diagnosis",
        desc: "NeuroScan classifies the scan into one of four categories: Glioma, Meningioma, Pituitary Tumor, or No Tumor. Confidence scores are displayed.",
        tip: "A confidence score above 90% indicates high model certainty.",
    },
    {
        icon: <Activity size={28} />,
        title: "4. Examine Grad-CAM Heatmap",
        desc: "If a tumor is detected, a Grad-CAM heatmap overlay highlights the region the model focused on. This provides visual evidence for the diagnosis.",
        tip: "Red areas indicate regions most influential to the model's decision.",
    },
    {
        icon: <FileText size={28} />,
        title: "5. Read the AI Analysis",
        desc: "An AI-generated clinical analysis provides context, tumor location description, and recommendations based on the findings.",
        tip: "The analysis is generated using RAG (Retrieval-Augmented Generation) for clinical accuracy.",
    },
    {
        icon: <Download size={28} />,
        title: "6. Generate & Share Report",
        desc: "Click 'Generate Report' to create a PDF containing all findings, images, and notes. Share the secure link with colleagues or patients.",
        tip: "Reports are stored securely and accessible via a unique short link.",
    },
];

export default function HowToUsePage() {
    return (
        <div className="page-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="page-header"
            >
                <span className="section-badge">Guide</span>
                <h1 className="page-title">How to Use NeuroScan</h1>
                <p className="page-desc">
                    A step-by-step walkthrough from MRI upload to clinical report.
                </p>
            </motion.div>

            {/* Flow diagram */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="how-flow"
            >
                {["Patient Info", "Upload MRI", "Diagnosis", "Grad-CAM", "AI Report", "PDF Export"].map(
                    (label, i) => (
                        <div key={label} className="how-flow-step">
                            <div className="how-flow-dot">{i + 1}</div>
                            <span className="how-flow-label">{label}</span>
                            {i < 5 && <ArrowRight size={16} className="how-flow-arrow" />}
                        </div>
                    )
                )}
            </motion.div>

            {/* Steps */}
            <div className="how-grid">
                {steps.map((s, i) => (
                    <motion.div
                        key={s.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="how-card"
                    >
                        <div className="how-card-icon">{s.icon}</div>
                        <h3 className="how-card-title">{s.title}</h3>
                        <p className="how-card-desc">{s.desc}</p>
                        <div className="how-card-tip">
                            <strong>💡 Tip:</strong> {s.tip}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="cta-card"
                style={{ marginTop: "4rem" }}
            >
                <h2 className="cta-title">Ready to Try It?</h2>
                <p className="cta-desc">
                    No sign-up required. Start diagnosing in under 30 seconds.
                </p>
                <Link href="/">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-primary cta-btn"
                    >
                        Go to Home <ArrowRight size={18} />
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
