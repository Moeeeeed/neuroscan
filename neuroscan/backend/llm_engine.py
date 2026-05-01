import os
import time
from dotenv import load_dotenv

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

# Load environment variables from .env file
load_dotenv()

def generate_rag_analysis(patient_details, diagnosis, confidence, location_text):
    """
    Connects to xAI's Grok API to generate a comprehensive medical report.
    Falls back to a mock engine if the API key is missing or an error occurs.
    """
    grok_api_key = os.getenv("GROK_API_KEY")
    
    # Try using Grok if the package is installed and key is provided (and not the default placeholder)
    if OPENAI_AVAILABLE and grok_api_key and grok_api_key != "your_grok_key_here":
        try:
            # xAI's API is compatible with the OpenAI SDK
            client = OpenAI(
                api_key=grok_api_key,
                base_url="https://api.x.ai/v1",
            )
            
            system_prompt = (
                "You are an advanced medical AI diagnostic assistant (NeuroScan) integrated with an MRI classification model. "
                "You must write a highly professional, clinical diagnostic assessment in 3 short paragraphs. "
                "Structure your response with these exact headers: '1. AI Visual Analysis', '2. Tumor Pathology Context', and '3. Clinical Implications & Recommendations'. "
                "Do not use markdown formatting like asterisks or bolding, just plain text."
            )
            
            user_prompt = (
                f"Patient Details: Name: {patient_details.get('name', 'N/A')}, Age: {patient_details.get('age', 'N/A')}, Gender: {patient_details.get('gender', 'N/A')}.\n"
                f"The AI model (ResNet50) detected: {diagnosis} with {confidence}% confidence.\n"
                f"The tumor mass is primarily located at: {location_text}.\n"
                f"Write the clinical assessment based on this data."
            )

            response = client.chat.completions.create(
                model="grok-2", # Updated to current stable model
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Grok API Error: {e}. Falling back to mock engine.")
            # If it fails, intentionally fall through to the mock engine below
    
    
    # --- MOCK FALLBACK ENGINE ---
    # This runs if no valid API key is found or if the API call fails
    time.sleep(1.5) # Simulate processing time
    
    if diagnosis == 'No Tumor':
        return (
            f"AI Analysis indicates no evidence of neoplastic growth. "
            f"The scans for patient {patient_details.get('name', 'N/A')} appear within normal anatomical limits. "
            f"Standard preventative follow-ups are recommended based on patient history."
        )
        
    tumor_type = diagnosis.split()[0] # e.g., 'Glioma', 'Meningioma', 'Pituitary'
    
    kb = {
        'Glioma': "Gliomas originate from the glial cells in the brain or spine. They can be highly invasive, often intertwining with healthy brain tissue, which complicates surgical resection. Depending on the grade, adjuvant radiotherapy and chemotherapy (e.g., Temozolomide) are standard protocols.",
        'Meningioma': "Meningiomas arise from the meninges (the membranes surrounding the brain and spinal cord). They are typically benign and slow-growing. Depending on the size and symptoms, observation or surgical resection is recommended. They often compress rather than invade adjacent brain tissue.",
        'Pituitary': "Pituitary adenomas occur in the pituitary gland at the base of the brain. They can cause hormonal imbalances and visual disturbances due to optic nerve compression. Transsphenoidal surgery is a common approach, often supplemented by endocrinological management."
    }
    
    tumor_context = kb.get(tumor_type, "Abnormal neoplastic growth detected requiring further histological classification.")
    
    report = (
        f"Diagnostic Assessment for Patient: {patient_details.get('name', 'N/A')} (Age: {patient_details.get('age', 'N/A')}, Gender: {patient_details.get('gender', 'N/A')}).\n\n"
        f"1. AI Visual Analysis\n"
        f"The NeuroScan ResNet50 model has detected anomalies consistent with a {diagnosis} with a confidence interval of {confidence}%.\n"
        f"XAI Grad-CAM localization indicates the primary mass is situated in the {location_text}.\n\n"
        f"2. Tumor Pathology Context\n"
        f"{tumor_context}\n\n"
        f"3. Clinical Implications & Recommendations\n"
        f"Given the location ({location_text}), potential localized mass effects should be evaluated. "
        f"A comprehensive neurological exam is advised to assess cranial nerve integrity and motor function. "
        f"Next steps should include an expedited neurosurgical consultation and a high-resolution MRI with gadolinium contrast for precise volumetry."
    )
    
    return report
