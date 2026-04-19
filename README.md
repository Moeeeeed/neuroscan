NeuroScan: Brain Tumor MRI Classification
NeuroScan is a deep learning-based medical imaging diagnostic web application. It utilizes a highly optimized Convolutional Neural Network (CNN) via Transfer Learning to classify MRI brain scans into four distinct categories: Glioma, Meningioma, Pituitary Tumor, and Healthy (No Tumor).

Features
Real-time Inference: Doctors can upload an MRI scan via a web dashboard and receive a diagnosis in milliseconds.

Confidence Scoring: Outputs the model's Softmax probability, providing medical professionals with the AI's exact confidence level.

High Recall Architecture: Optimized to prioritize true positive tumor detection, minimizing fatal false negatives in critical cases like Pituitary tumors.

Automated Preprocessing: The backend dynamically resizes, color-corrects, and normalizes uploaded images to match the model's exact tensor requirements.

🛠️ Tech Stack
Deep Learning Framework: TensorFlow / Keras

Base Architecture: ResNet50 (Pre-trained on ImageNet)

Computer Vision: OpenCV (cv2)

Backend Web Framework: Fast API

Data Processing & Math: NumPy, Scikit-Learn

Data Visualization: Matplotlib, Seaborn

Frontned: Next.js
