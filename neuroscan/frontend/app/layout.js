import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "NeuroScan AI — Brain Tumor MRI Classification",
  description:
    "AI-powered brain tumor diagnostic platform. Upload MRI scans and receive real-time classification with Grad-CAM visualization and AI-generated clinical reports.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-wrapper">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
