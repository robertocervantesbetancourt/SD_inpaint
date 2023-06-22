import React, { useState, useEffect } from 'react';
import StabilityAPI from './StabilityAPI';
import DrawingOnImage from './Drawing';


const App = () => {
  const [initImage, setInitImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [device, setDevice] = useState(null);
  const [deviceType, setDeviceType] = useState("Desktop");

//function that detects if the user is on a mobile device and changes the state of deviceType
  const detectDevice = () => {
    if (window.innerWidth < 600) {
      setDeviceType("Mobile");
    }
  }

  useEffect(() => {
    detectDevice();
  },[])

  


  const handleClick = async () => {
    if (!initImage || !maskImage) {
      console.error('Please upload both images');
      return;
    }

  //   const success = await StabilityAPI(initImage, maskImage, prompt);
  //   if (success) {
  //     console.log('Image download successful!');
  //   } else {
  //     console.log('Image download failed!');
  //   }
  // };

  const generatedImageData = await StabilityAPI(initImage, maskImage, prompt);
  if (generatedImageData) {
    setGeneratedImage(generatedImageData);
  } else {
    console.log('Image generation failed!');
  }
};


  const handleChange = (event) => {
    setPrompt(event.target.value);
  };

  return (
    <div>
      <h1>Stability App</h1>
      <p>Your device is {deviceType}</p>

      <DrawingOnImage InitialImage={setInitImage} TheMask={setMaskImage}/>
      {maskImage &&
      <>
      <textarea
        value={prompt}
        onChange={handleChange}
        placeholder="Write a short text blurb..."
      />
      <p>Character count: {prompt.length}</p>
      </>
      }
      {prompt.length > 0 &&
      <button onClick={handleClick}>Generate AI Image</button>
      }
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
