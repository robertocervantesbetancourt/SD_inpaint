import React, { useState, useEffect } from "react";
import StabilityAPI from "./StabilityAPI";
import DrawingOnImage from "./Drawing";
import DrawingMobile from "./DrawingMobile";
import { MdTouchApp, MdMouse } from "react-icons/md";

const App = () => {
  const [initImage, setInitImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState("mobile");

  const handleToggle = () => {
    const newOption = selectedOption === "mobile" ? "desktop" : "mobile";
    setSelectedOption(newOption);
  };

  const handleGenerateAI = async () => {
    if (!initImage || !maskImage) {
      console.error("Please upload both images");
      return;
    }

    const generatedImageData = await StabilityAPI(initImage, maskImage, prompt);
    if (generatedImageData) {
      setGeneratedImage(generatedImageData);
    } else {
      console.log("Image generation failed!");
    }
  };

  const handleChange = (event) => {
    setPrompt(event.target.value);
  };

  return (
    <div className="mx-10 my-4">
      <h1 className="text-3xl font-sans">Transform Your Images</h1>
      <div className="flex flex-row mt-4">
        <button onClick={handleToggle}>
          <MdTouchApp
            className={`text-2xl ${
              selectedOption === "mobile" ? "text-gray-950" : "text-gray-400"
            }`}
          />
        </button>
        <button
          className={`border-2 w-12 h-6  rounded-xl p-1 flex content-center items-center justify-start ${
            selectedOption === "mobile" ? "justify-start" : "justify-end"
          }`}
          onClick={handleToggle}
        >
          <div className="w-4 h-4 bg-white rounded-full bg-gray-800"></div>
        </button>
        <button onClick={handleToggle}>
          <MdMouse
            className={`text-2xl ${
              selectedOption === "mobile" ? "text-gray-400" : "text-gray-950"
            }`}
          />
        </button>
      </div>

      {selectedOption === "mobile" ? (
        <DrawingMobile InitialImage={setInitImage} TheMask={setMaskImage} />
      ) : (
        <DrawingOnImage InitialImage={setInitImage} TheMask={setMaskImage} MagicTransform={handleGenerateAI} />
      )}

      {maskImage && (
        <>
          <textarea
            value={prompt}
            onChange={handleChange}
            placeholder="Write a short text blurb..."
          />
          <p>Character count: {prompt.length}</p>
        </>
      )}
      {prompt.length > 0 && (
        <button onClick={handleGenerateAI}>Generate AI Image</button>
      )}
      {generatedImage && (
        <div>
          <h2>Generated Image</h2>
          <img src={URL.createObjectURL(generatedImage)} alt="Generated" />
        </div>
      )}
    </div>
  );
};

export default App;
