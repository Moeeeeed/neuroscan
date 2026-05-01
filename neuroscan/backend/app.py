import os
import uuid
import base64
from datetime import datetime
from io import BytesIO

from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
import numpy as np
import cv2
import tensorflow as tf
from jinja2 import Environment, FileSystemLoader

# Try importing weasyprint for PDF generation
try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except Exception as e:
    print(f"Warning: WeasyPrint could not be initialized ({e}). PDF generation will be disabled.")
    print("To fix this on macOS, run: brew install pango libffi")
    WEASYPRINT_AVAILABLE = False

from gradcam import make_gradcam_heatmap, overlay_gradcam, get_tumor_location
from llm_engine import generate_rag_analysis

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Global configuration
MODEL_DIR = '/Users/abdulmoeed/Desktop/neuroscanModel.keras'
WEIGHTS_PATH = os.path.join(MODEL_DIR, 'model.weights.h5')
REPORTS_DIR = os.path.join(os.path.dirname(__file__), 'reports')
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(REPORTS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Define classes (Standard alphabetical order for brain tumor datasets)
CLASSES = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary Tumor']

def build_model():
    """
    Rebuild the exact same architecture from the saved config:
    Sequential: ResNet50 (ImageNet) -> GlobalAveragePooling2D -> Dense(256, relu) -> Dropout(0.5) -> Dense(4, softmax)
    """
    base_model = tf.keras.applications.ResNet50(
        weights=None,  # We will load weights from the .h5 file
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    model = tf.keras.Sequential([
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(name='global_average_pooling2d_1'),
        tf.keras.layers.Dense(256, activation='relu', name='dense_2'),
        tf.keras.layers.Dropout(0.5, name='dropout_1'),
        tf.keras.layers.Dense(4, activation='softmax', name='dense_3')
    ])
    
    # Build the model so weights can be loaded
    model.build(input_shape=(None, 224, 224, 3))
    return model

# Load the Model
print(f"Loading Keras model weights from {WEIGHTS_PATH}...")
try:
    model = build_model()
    model.load_weights(WEIGHTS_PATH)
    print("Model loaded successfully!")
    
    # The last conv layer in ResNet50 for Grad-CAM
    last_conv_layer_name = 'conv5_block3_out'
    # Verify it exists inside the ResNet50 base
    resnet_base = model.layers[0]
    try:
        resnet_base.get_layer(last_conv_layer_name)
        print(f"Selected last conv layer for Grad-CAM: {last_conv_layer_name}")
    except ValueError:
        # Fallback: find the last conv layer dynamically
        last_conv_layer_name = None
        for sub_layer in reversed(resnet_base.layers):
            if 'conv' in sub_layer.name.lower() and not 'bn' in sub_layer.name.lower():
                last_conv_layer_name = sub_layer.name
                break
        print(f"Fallback conv layer for Grad-CAM: {last_conv_layer_name}")
        
except Exception as e:
    print(f"Error loading model: {e}")
    import traceback
    traceback.print_exc()
    model = None
    last_conv_layer_name = None

@app.route('/')
def home():
    return "<h1>NeuroScan Backend is Running</h1><p>Please use the Next.js frontend at http://localhost:3000</p>"

def preprocess_image(image_bytes):
    """
    Decodes image, converts BGR to RGB, resizes to 224x224, normalizes.
    """
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    
    # Keep a copy for Grad-CAM overlay
    original_img = img.copy()
    
    # Normalize and expand dims for model
    img_array = img / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return original_img, img_array

def encode_image_base64(img_array_rgb):
    """Encodes a numpy RGB image array to base64 jpeg string."""
    img_bgr = cv2.cvtColor(img_array_rgb, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode('.jpg', img_bgr)
    return base64.b64encode(buffer).decode('utf-8')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded on server.'}), 500
        
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request.'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected.'}), 400

    try:
        # Read and preprocess
        image_bytes = file.read()
        original_img, img_array = preprocess_image(image_bytes)
        
        # 1. Prediction
        predictions = model.predict(img_array)
        confidence = float(np.max(predictions[0]))
        predicted_class_idx = np.argmax(predictions[0])
        diagnosis = CLASSES[predicted_class_idx]
        is_tumor = diagnosis != 'No Tumor'
        
        # Save original temporarily for Grad-CAM processing if needed
        temp_img_path = os.path.join(UPLOADS_DIR, f"temp_{uuid.uuid4().hex}.jpg")
        cv2.imwrite(temp_img_path, cv2.cvtColor(original_img, cv2.COLOR_RGB2BGR))
        
        # Get patient details from form data if provided
        patient_details_str = request.form.get('patientDetails', '{}')
        import json
        try:
            patient_details = json.loads(patient_details_str)
        except:
            patient_details = {}
            
        # 2. Grad-CAM Generation & Location Extraction
        gradcam_base64 = None
        location_text = None
        location_coords = None
        llm_analysis = None
        
        if is_tumor and last_conv_layer_name:
            try:
                # Generate heatmap array
                heatmap = make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=predicted_class_idx)
                
                # Get tumor location from heatmap
                location_text, location_coords = get_tumor_location(heatmap)
                
                # Overlay it onto the image
                gradcam_img_rgb = overlay_gradcam(temp_img_path, heatmap)
                # Encode to base64 for frontend
                gradcam_base64 = encode_image_base64(gradcam_img_rgb)
                
                # Generate RAG Analysis
                llm_analysis = generate_rag_analysis(patient_details, diagnosis, round(confidence * 100, 2), location_text)
            except Exception as e:
                print(f"Grad-CAM generation failed: {e}")
                import traceback
                traceback.print_exc()
        
        # Clean up temp file
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)
            
        # Also send original image as base64 so we have it for the PDF generation later
        original_base64 = encode_image_base64(original_img)

        return jsonify({
            'diagnosis': diagnosis,
            'confidence': confidence,
            'gradCamImage': gradcam_base64,
            'originalImage': original_base64,
            'locationText': location_text,
            'locationCoords': location_coords,
            'llmAnalysis': llm_analysis,
            'patientDetails': patient_details
        })

    except Exception as e:
        print(e)
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/generate-report', methods=['POST'])
def generate_report():
    if not WEASYPRINT_AVAILABLE:
        return jsonify({'error': 'WeasyPrint is not installed on the server.'}), 500
        
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided.'}), 400
        
    diagnosis = data.get('diagnosis', 'Unknown')
    confidence = data.get('confidence', 0.0)
    original_base64 = data.get('originalImage', '')
    gradcam_base64 = data.get('gradCamImage', '')
    location_text = data.get('locationText', 'N/A')
    doctor_notes = data.get('doctorNotes', '')
    llm_analysis = data.get('llmAnalysis', '')
    patient_details = data.get('patientDetails', {})
    
    is_tumor = diagnosis != 'No Tumor'
    report_id = str(uuid.uuid4())
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    try:
        # Load Jinja2 template
        env = Environment(loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))
        template = env.get_template('report.html')
        
        # Render HTML
        html_out = template.render(
            report_id=report_id,
            date=date_str,
            diagnosis=diagnosis,
            confidence=round(confidence * 100, 2),
            is_tumor=is_tumor,
            original_image=original_base64,
            gradcam_image=gradcam_base64,
            location_text=location_text,
            doctor_notes=doctor_notes,
            llm_analysis=llm_analysis,
            patient_details=patient_details
        )
        
        # Convert HTML to PDF using WeasyPrint
        pdf_path = os.path.join(REPORTS_DIR, f"{report_id}.pdf")
        HTML(string=html_out).write_pdf(pdf_path)
        
        # Generate secure short link
        report_url = f"http://127.0.0.1:5000/reports/{report_id}"
        
        return jsonify({
            'success': True,
            'report_id': report_id,
            'report_url': report_url
        })
        
    except Exception as e:
        print(f"Error generating PDF: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    pdf_path = os.path.join(REPORTS_DIR, f"{report_id}.pdf")
    if os.path.exists(pdf_path):
        return send_file(pdf_path, as_attachment=True, download_name=f"NeuroScan_Report_{report_id[:8]}.pdf")
    else:
        return jsonify({'error': 'Report not found or expired.'}), 404

if __name__ == '__main__':
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
