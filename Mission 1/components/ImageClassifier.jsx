import React, { useState } from "react";

function ImageClassifier() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For displaying uploaded image
  const [result, setResult] = useState("Waiting for an image...");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    // gets the first uploaded file
    setImage(file);
    // updates image file with the uploaded file
    setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    setResult("Image uploaded. Ready to classify.");
    // updates status message
  };

  const classifyImage = async () => {
    if (!image) {
      setResult("Please upload an image first.");
      return;
    }
    // checks if image has been uploaded (sends error if not)

    setLoading(true);
    setResult("Classifying...");

    try {
      const response = await fetch(
        "https://motorbikeandcartraining-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/36be089e-fc26-4556-8789-556d055a6cdd/detect/iterations/Iteration4/image",
        {
          method: "POST",
          headers: {
            "Prediction-Key":
              "CZkqcuHmNixJ70q6tQ1JMngmK0v4iWEKFgkgetGz0G2ZiZM6I2xqJQQJ99AKACYeBjFXJ3w3AAAIACOG4cZz",
            "Content-Type": "application/octet-stream",
            // specifies binary nature of the image date in body
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
        // .reduce finds the prediction with the highest probability
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
      // makes sure loading is set to false after the process finishes
    }
  };

  return (
    <div>
      <h2>Upload an image to find out your premium</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br></br>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Uploaded preview"
          style={{ width: "300px", marginTop: "20px" }}
        />
      )}{" "}
      <br></br>
      <button onClick={classifyImage} disabled={loading}>
        {loading ? "Classifying..." : "Classify Image"}
        {/* disabled loading prevents multiple submissions while the image is being classified */}
      </button>
      {/* Display uploaded image */}
      <br></br>
      <h3>Classification Result:</h3>
      <div>{result}</div>
    </div>
  );
}

export default ImageClassifier;
