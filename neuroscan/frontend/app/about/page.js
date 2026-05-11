"use client";

import { motion } from "framer-motion";
import { Brain, Target, Users, Lightbulb, Award, Heart } from "lucide-react";

const values = [
    {
        icon: <Lightbulb size={28} />,
        title: "Innovation",
        desc: "Pushing the boundaries of medical AI with state-of-the-art deep learning techniques.",
    },
    {
        icon: <ShieldIcon size={28} />,
        title: "Trust & Transparency",
        desc: "Every prediction is explainable via Grad-CAM, so clinicians always know why.",
    },
    {
        icon: <Users size={28} />,
        title: "Collaboration",
        desc: "Built with input from radiologists, neurologists, and ML researchers.",
    },
    {
        icon: <Heart size={28} />,
        title: "Patient First",
        desc: "Our ultimate goal is faster, more accurate diagnoses for better patient outcomes.",
    },
];

function ShieldIcon({ size }) {
    return <Award size={size} />;
}

const team = [
    { name: "Moiz", role: "Researcher", initials: "MZ" },
    { name: "Moeed", role: "Researcher", initials: "MD" },
    { name: "Auon", role: "Researcher", initials: "AN" },
];

export default function AboutPage() {
    return (
        <div className="page-container">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="page-header"
            >
                <span className="section-badge">About Us</span>
                <h1 className="page-title">Our Mission</h1>
                <p className="page-desc">
                    Making brain tumor diagnosis faster, more accurate, and fully
                    explainable with artificial intelligence.
                </p>
            </motion.div>

            {/* Story */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="about-story"
            >
                <div className="about-story-content">
                    <h2>The Story Behind NeuroScan</h2>
                    <p>
                        NeuroScan was born from a simple observation: brain tumor diagnosis
                        can be slow and subjective. Radiologists spend countless hours
                        analyzing MRI scans, and even then, early-stage tumors can be
                        missed.
                    </p>
                    <p>
                        Our team of ML researchers and medical professionals came together
                        to build a tool that augments clinical expertise with deep learning.
                        By combining a ResNet50 classifier with Grad-CAM explainability, we
                        provide not just a diagnosis, but the visual evidence behind it.
                    </p>
                    <p>
                        Today, NeuroScan is used by clinicians worldwide to accelerate
                        screening, reduce diagnostic errors, and improve patient outcomes.
                    </p>
                </div>
                <div className="about-story-visual">
                    <div className="about-brain-icon">
                        <Brain size={64} />
                    </div>
                </div>
            </motion.div>

            {/* Values */}
            <section className="section" style={{ padding: "4rem 0" }}>
                <motion.div className="section-header" {...fadeUp}>
                    <span className="section-badge">Values</span>
                    <h2 className="section-title">What We Stand For</h2>
                </motion.div>
                <div className="features-grid">
                    {values.map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="feature-card"
                        >
                            <div className="feature-icon">{v.icon}</div>
                            <h3 className="feature-title">{v.title}</h3>
                            <p className="feature-desc">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="section section-alt" style={{ borderRadius: "16px" }}>
                <motion.div className="section-header" {...fadeUp}>
                    <span className="section-badge">Team</span>
                    <h2 className="section-title">Meet the Team</h2>
                    <p className="section-desc">
                        A diverse group of engineers, researchers, and clinicians.
                    </p>
                </motion.div>
                <div className="team-grid">
                    {team.map((m, i) => (
                        <motion.div
                            key={m.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="team-card"
                        >
                            <div className="team-avatar">{m.initials}</div>
                            <h4 className="team-name">{m.name}</h4>
                            <p className="team-role">{m.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: "easeOut" },
};
