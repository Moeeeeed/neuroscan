import numpy as np
import tensorflow as tf
import cv2
from scipy.ndimage import center_of_mass
import math

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Generates a Grad-CAM heatmap for a given image array and model.
    Handles nested models (e.g., Sequential with ResNet50 base inside).
    """
    base_model = model.layers[0]  # This is the ResNet50 Functional model
    last_conv_layer = base_model.get_layer(last_conv_layer_name)
    
    # Create a single functional model mapping inputs to both conv outputs and base outputs
    grad_base_model = tf.keras.Model(
        inputs=[base_model.input],
        outputs=[last_conv_layer.output, base_model.output]
    )
    
    remaining_layers = model.layers[1:]
    
    with tf.GradientTape() as tape:
        # Forward pass: get both intermediate and final base model outputs
        conv_outputs, base_outputs = grad_base_model(img_array)
        tape.watch(conv_outputs)
        
        # Continue through classification head
        x = base_outputs
        for layer in remaining_layers:
            x = layer(x)
        preds = x
        
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    # Gradients now flow correctly through the connected graph
    grads = tape.gradient(class_channel, conv_outputs)

    if grads is None:
        raise ValueError("Gradients are None. Graph disconnected.")

    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def get_tumor_location(heatmap):
    """
    Analyzes the heatmap to find the center of mass of the activations,
    returning a text description and normalized 3D coordinates.
    """
    # Threshold heatmap to ignore low-confidence areas
    thresholded = np.where(heatmap > 0.5, heatmap, 0)
    
    # If heatmap is entirely empty after thresholding, fallback to non-thresholded
    if np.sum(thresholded) == 0:
        thresholded = heatmap
        
    cy, cx = center_of_mass(thresholded)
    
    # Handle NaN if heatmap is completely zero
    if math.isnan(cy) or math.isnan(cx):
        return "Unknown Region", [0, 0, 0]
        
    h, w = heatmap.shape
    
    # Normalize to [-1, 1] range (Center is 0,0)
    norm_x = (cx / w) * 2 - 1
    norm_y = -((cy / h) * 2 - 1) # Invert Y so top is positive
    
    lr = "Image Right Hemisphere" if norm_x > 0 else "Image Left Hemisphere"
    tb = "Anterior Region" if norm_y > 0 else "Posterior Region"
    
    if abs(norm_x) < 0.25 and abs(norm_y) < 0.25:
        region = "Central Brain Region"
    else:
        region = f"{lr}, {tb}"
        
    # Return region text and [x, y, z] coords for 3D viewer
    return region, [float(norm_x), float(norm_y), 0]

def overlay_gradcam(img_path, heatmap, alpha=0.4):
    """
    Overlays the heatmap on the original image.
    """
    img = cv2.imread(img_path)
    img = cv2.resize(img, (224, 224))
    
    heatmap_resized = cv2.resize(heatmap, (224, 224))
    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    jet = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)

    superimposed_img = jet * alpha + img
    superimposed_img = np.clip(superimposed_img, 0, 255).astype(np.uint8)

    superimposed_img_rgb = cv2.cvtColor(superimposed_img, cv2.COLOR_BGR2RGB)
    return superimposed_img_rgb
