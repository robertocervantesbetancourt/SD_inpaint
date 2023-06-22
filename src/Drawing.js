// import React, { useState, useRef, useEffect } from 'react';


// function DrawingOnImage({InitialImage, TheMask}) {
//   const canvasRef = useRef(null);
//   const [isPainting, setIsPainting] = useState(false);
//   const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
//   const [initImage, setInitImage] = useState(null);

  

//   const handleImageUpload = (event) => {
//     InitialImage(event.target.files[0]);
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//       setInitImage(reader.result);
//     };

//     if (file) {
//       reader.readAsDataURL(file);
//       // console.log("drawing upload", initImage)
//     }
//   };


//   const handleCanvasMouseDown = (event) => {
//     setIsPainting(true);
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;
//     setPrevPos({ x, y });
//   };

//   const handleCanvasMouseUp = () => {
//     setIsPainting(false);
//   };

//   const handleCanvasMouseMove = (event) => {
//     if (!isPainting) {
//       return;
//     }

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const rect = canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     ctx.strokeStyle = '#FFFFFF'; // Set line color to white
//     ctx.lineWidth = 40;
//     ctx.lineJoin = 'round';
//     ctx.lineCap = 'round';
//     ctx.beginPath();
//     ctx.moveTo(prevPos.x, prevPos.y);
//     ctx.lineTo(x, y);
//     ctx.stroke();

//     setPrevPos({ x, y });
//   };


//   // Helper function to convert data URL to Blob
//   const dataURLToBlob = (dataURL) => {
//     const arr = dataURL.split(',');
//     const mime = arr[0].match(/:(.*?);/)[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new Blob([u8arr], { type: mime });
//   };


//   const handleSaveImage = () => {
//     const canvas = canvasRef.current;
//     const dataURL = canvas.toDataURL('image/jpeg');
//     const blob = dataURLToBlob(dataURL);
//     const file = new File([blob], 'drawing.jpg', { type: 'image/jpeg' });
  
//     // Use the file object as needed
//     // For example, you can upload it to a server using FormData or perform other operations
  
//     // Save the mask image data URL in the state
//     TheMask(file);
//     // mask(file);
//   };
  


  

//   return (
//     <div>
//       <p>Canvas</p>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       {initImage && (
//         <div
//           style={{
//             width: '512px',
//             height: '512px',
//             backgroundImage: `url(${initImage})`,
//             backgroundSize: 'cover',
//             position: 'relative',
//           }}
//         >
//           <canvas
//             ref={canvasRef}
//             id="canvas"
//             width="512"
//             height="512"
//             style={{ position: 'absolute', top: 0, left: 0 }}
//             onMouseDown={handleCanvasMouseDown}
//             onMouseUp={handleCanvasMouseUp}
//             onMouseMove={handleCanvasMouseMove}
//           ></canvas>
//         </div>
//       )}
//       {initImage && (
//         <button onClick={handleSaveImage} className='bg-blue-400 p-2 rounded'>Save Mask</button>
//       )}
//     </div>
//   );
// }

// export default DrawingOnImage;

import React, { useState, useRef, useEffect } from 'react';

function DrawingOnImage({ InitialImage, TheMask }) {
  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [initImage, setInitImage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#FFFFFF'; // Set line color to white
      ctx.lineWidth = 40;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
    }
  }, []);
  

  const handleImageUpload = (event) => {
    InitialImage(event.target.files[0]);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setInitImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasMouseDown = (event) => {
    setIsPainting(true);
    const [x, y] = getCursorPosition(event);
    setPrevPos({ x, y });
  };

  const handleCanvasMouseUp = () => {
    setIsPainting(false);
  };

  const handleCanvasMouseMove = (event) => {
    if (!isPainting) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const [x, y] = getCursorPosition(event);

    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.strokeStyle = '#FFFFFF'; // Set line color to white
    ctx.lineWidth = 40;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    setPrevPos({ x, y });
  };

  const handleCanvasTouchStart = (event) => {
    event.preventDefault();
    const [x, y] = getTouchPosition(event);
    handleCanvasMouseDown({ clientX: x, clientY: y });
  };

  const handleCanvasTouchEnd = (event) => {
    event.preventDefault();
    handleCanvasMouseUp();
  };

  const handleCanvasTouchMove = (event) => {
    event.preventDefault();
    const [x, y] = getTouchPosition(event);
    handleCanvasMouseMove({ clientX: x, clientY: y });
  };

  const getCursorPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
  };

  const getTouchPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return [x, y];
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/jpeg');
    const blob = dataURLToBlob(dataURL);
    const file = new File([blob], 'drawing.jpg', { type: 'image/jpeg' });

    TheMask(file);
  };

  const dataURLToBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <div>
      <p>Canvas</p>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {initImage && (
        <div
          style={{
            width: '512px',
            height: '512px',
            backgroundImage: `url(${initImage})`,
            backgroundSize: 'cover',
            position: 'relative',
          }}
        >
          <canvas
            ref={canvasRef}
            id="canvas"
            width="512"
            height="512"
            style={{ position: 'absolute', top: 0, left: 0 }}
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={handleCanvasMouseUp}
            onMouseMove={handleCanvasMouseMove}
            onTouchStart={handleCanvasTouchStart}
            onTouchEnd={handleCanvasTouchEnd}
            onTouchMove={handleCanvasTouchMove}
          ></canvas>
        </div>
      )}
      {initImage && (
        <button onClick={handleSaveImage} className="bg-blue-400 p-2 rounded">
          Save Mask
        </button>
      )}
    </div>
  );
}

export default DrawingOnImage;
