import React, { useState, useEffect } from 'react';
import StabilityAPI from './StabilityAPI';
import DrawingOnImage from './Drawing';


const App = () => {
  const [initImage, setInitImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [prompt, setPrompt] = useState("");


  const handleClick = async () => {
    if (!initImage || !maskImage) {
      console.error('Please upload both images');
      return;
    }

    const success = await StabilityAPI(initImage, maskImage, prompt);
    if (success) {
      console.log('Image download successful!');
    } else {
      console.log('Image download failed!');
    }
  };


  const handleChange = (event) => {
    setPrompt(event.target.value);
  };

  return (
    <div>
      <h1>Stability App</h1>

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
    </div>
  );
};

export default App;
