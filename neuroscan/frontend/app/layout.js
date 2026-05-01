import "./globals.css";

export const metadata = {
  title: "NeuroScan - Brain Tumor MRI Classification",
  description: "AI-powered web application that allows doctors to upload MRI scans and receive real-time diagnosis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
