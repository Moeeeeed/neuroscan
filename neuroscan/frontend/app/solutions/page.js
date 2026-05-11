"use client";

import { motion } from "framer-motion";
import {
    Brain,
    Building2,
    Microscope,
    Stethoscope,
    GraduationCap,
    Globe,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

const solutions = [
    {
        icon: <Building2 size={32} />,
        title: "Hospitals & Clinics",
        desc: "Deploy NeuroScan as an on-premise or cloud-based diagnostic aid for radiology departments. Integrate with existing PACS systems.",
        features: ["On-premise deployment", "PACS integration", "Bulk analysis", "HIPAA compliant"],
    },
    {
        icon: <Microscope size={32} />,
        title: "Research Institutions",
        desc: "Accelerate brain tumor research with our explainable AI pipeline. Use Grad-CAM outputs for further analysis and publication.",
        features: ["Custom model fine-tuning", "Batch processing", "Exportable heatmaps", "API access"],
    },
    {
        icon: <GraduationCap size={32} />,
        title: "Medical Education",
        desc: "Train the next generation of radiologists with an interactive AI teaching tool that shows exactly how tumors are identified.",
        features: ["Educational dashboard", "Case library", "Visual explanations", "Progress tracking"],
    },
    {
        icon: <Globe size={32} />,
        title: "Telemedicine Platforms",
        desc: "Integrate NeuroScan into telemedicine workflows for remote diagnosis and second opinions across geographic boundaries.",
        features: ["REST API", "Real-time inference", "PDF reports", "Multi-language support"],
    },
];

export default function SolutionsPage() {
    return (
        <div className="page-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="page-header"
            >
                <span className="section-badge">Solutions</span>
                <h1 className="page-title">Built for Every Setting</h1>
                <p className="page-desc">
                    From large hospitals to individual practitioners — NeuroScan adapts to
                    your workflow.
                </p>
            </motion.div>

            <div className="solutions-list">
                {solutions.map((s, i) => (
                    <motion.div
                        key={s.title}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.12 }}
                        className="solution-card"
                    >
                        <div className="solution-card-left">
                            <div className="solution-icon">{s.icon}</div>
                            <div>
                                <h3 className="solution-title">{s.title}</h3>
                                <p className="solution-desc">{s.desc}</p>
                            </div>
                        </div>
                        <div className="solution-card-right">
                            <ul className="solution-features">
                                {s.features.map((f) => (
                                    <li key={f}>{f}</li>
                                ))}
                            </ul>
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
                <h2 className="cta-title">Not Sure Which Solution Fits?</h2>
                <p className="cta-desc">
                    Contact our team for a personalized consultation and demo.
                </p>
                <Link href="/contact">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-primary cta-btn"
                    >
                        Contact Us <ArrowRight size={18} />
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
