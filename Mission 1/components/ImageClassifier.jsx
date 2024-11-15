import React, { useState } from "react";

function ImageClassifier() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("Waiting for an image...");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
    setResult("Image uploaded. Ready to classify.");
  };

  const classifyImage = async () => {
    if (!image) {
      setResult("Please upload an image first.");
      return;
    }

    setLoading(true);
    setResult("Classifying...");

    try {
      const response = await fetch(
        "https://motorbikeandcartraining-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/36be089e-fc26-4556-8789-556d055a6cdd/detect/iterations/Iteration2/image",
        {
          method: "POST",
          headers: {
            "Prediction-Key":
              "CZkqcuHmNixJ70q6tQ1JMngmK0v4iWEKFgkgetGz0G2ZiZM6I2xqJQQJ99AKACYeBjFXJ3w3AAAIACOG4cZz",
            "Content-Type": "application/octet-stream",
          },
          body: image,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.predictions && data.predictions.length > 0) {
        // Find the prediction with the highest probability
        const bestPrediction = data.predictions.reduce((max, prediction) =>
          prediction.probability > max.probability ? prediction : max
        );

        const resultText = `Class: ${bestPrediction.tagName}, Confidence: ${(
          bestPrediction.probability * 100
        ).toFixed(2)}%`;
        setResult(resultText);
      } else {
        setResult("No classifications found.");
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload an Image for Classification</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={classifyImage} disabled={loading}>
        {loading ? "Classifying..." : "Classify Image"}
      </button>

      <h3>Classification Result:</h3>
      <div>{result}</div>
    </div>
  );
}

export default ImageClassifier;