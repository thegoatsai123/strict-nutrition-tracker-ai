
# ML Model Integration Guide

This system provides a flexible architecture for integrating any machine learning model for food recognition. Here's how to use it:

## Quick Start

1. **Replace the CustomModelProvider**: Edit `src/services/mlModels/providers/CustomModelProvider.ts`
2. **Add your model files**: Place your model in `/public/models/` directory
3. **Configure the preprocessing**: Update the `preprocessImage` method for your model's requirements

## Supported Model Formats

### TensorFlow.js
```javascript
// In CustomModelProvider.initialize()
const { loadLayersModel } = await import('@tensorflow/tfjs');
this.model = await loadLayersModel('/models/food-recognition/model.json');
```

### ONNX Runtime
```javascript
// In CustomModelProvider.initialize()
const ort = await import('onnxruntime-web');
this.model = await ort.InferenceSession.create('/models/food-recognition/model.onnx');
```

### Hugging Face Transformers
```javascript
// Already implemented in HuggingFaceProvider
const { pipeline } = await import('@huggingface/transformers');
this.pipeline = await pipeline('image-classification', 'your-model-name');
```

## Adding a New Model Provider

1. Create a new file in `src/services/mlModels/providers/`
2. Implement the `MLModelProvider` interface
3. Add it to the ModelManager constructor

```typescript
export class YourCustomProvider implements MLModelProvider {
  name = 'your-custom-model';
  
  async initialize(): Promise<void> {
    // Load your model
  }
  
  async isAvailable(): Promise<boolean> {
    // Check if model is ready
  }
  
  async predict(imageFile: File): Promise<FoodPrediction[]> {
    // Run inference
  }
}
```

## Model Performance Tips

- Keep models under 10MB for web deployment
- Use quantization to reduce model size
- Implement proper error handling and fallbacks
- Add loading states for better UX
- Consider using WebGPU for faster inference

## Integration Examples

### Your Custom CNN Model
```typescript
// Replace the mock prediction in CustomModelProvider.predict()
const predictions = await this.model.predict(imageData);
const results = predictions.dataSync();

return [
  {
    className: classNames[argMax(results)],
    confidence: Math.max(...results),
    nutrients: nutritionData[argMax(results)]
  }
];
```

### External API Integration
```typescript
// Use CloudAPIProvider or create a new one
const response = await fetch('your-api-endpoint', {
  method: 'POST',
  body: formData
});
```

## Testing Your Integration

1. Upload an image in the app
2. Check the browser console for logs
3. Verify predictions are returned correctly
4. Test fallback mechanisms

The system automatically handles provider fallbacks, so if your custom model fails, it will try other available providers.
