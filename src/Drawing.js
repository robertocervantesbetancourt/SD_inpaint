import React, { useState, useRef, useEffect } from 'react';
import {PiImageFill} from 'react-icons/pi';
import {RxMaskOn, RxDividerVertical, RxMagicWand} from 'react-icons/rx';
import {MdDelete} from 'react-icons/md';

function DrawingOnImage({ InitialImage, TheMask, MagicTransform }) {
  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [initImage, setInitImage] = useState(null);
  const ongoingTouchesRef = useRef([]);
  const fileInputRef = useRef(null);

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


  // const handleImageUpload = (event) => {
    
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  
  //   reader.onload = () => {
  //     const image = new Image();
  //     image.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       const context = canvas.getContext('2d');
  //       canvas.width = 512;
  //       canvas.height = 512;
  //       context.drawImage(image, 0, 0, canvas.width, canvas.height);
  //       const resizedImageUrl = canvas.toDataURL('image/jpeg');
  //       const blob = dataURLToBlob(resizedImageUrl);
  //       const file = new File([blob], 'drawing.jpg', { type: 'image/jpeg' });
    
  //       InitialImage(file);
  
  //       setInitImage(resizedImageUrl);
        
  //     };
  
  //     image.src = reader.result;
  //   };
  
  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageUpload = () => {
    // Open the file selection dialog
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = 512;
          canvas.height = 512;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const resizedImageUrl = canvas.toDataURL('image/jpeg');
          const blob = dataURLToBlob(resizedImageUrl);
          const newFile = new File([blob], 'drawing.jpg', { type: 'image/jpeg' });

          InitialImage(newFile);
          setInitImage(resizedImageUrl);
        };

        image.src = reader.result;
      };

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
    const touches = event.changedTouches;
    const offsetX = canvasRef.current.getBoundingClientRect().left;
    const offsetY = canvasRef.current.getBoundingClientRect().top;

    for (let i = 0; i < touches.length; i++) {
      ongoingTouchesRef.current.push(copyTouch(touches[i]));
    }

    const syntheticMouseEvent = createMouseEvent(touches[0], offsetX, offsetY);
    handleCanvasMouseDown(syntheticMouseEvent);
  };

  const handleCanvasTouchEnd = (event) => {
    event.preventDefault();
    handleCanvasMouseUp();
  };

  const handleCanvasTouchMove = (event) => {
    event.preventDefault();
    const touches = event.changedTouches;
    const offsetX = canvasRef.current.getBoundingClientRect().left;
    const offsetY = canvasRef.current.getBoundingClientRect().top;

    for (let i = 0; i < touches.length; i++) {
      const idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        const syntheticMouseEvent = createMouseEvent(touches[i], offsetX, offsetY);
        handleCanvasMouseMove(syntheticMouseEvent);
        ongoingTouchesRef.current.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
      }
    }
  };

  const createMouseEvent = (touch, offsetX, offsetY) => {
    return {
      clientX: touch.clientX - offsetX,
      clientY: touch.clientY - offsetY
    };
  };

  const getCursorPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
  };

  const copyTouch = ({ identifier, clientX, clientY }) => {
    return { identifier, clientX, clientY };
  };

  const ongoingTouchIndexById = (idToFind) => {
    const ongoingTouches = ongoingTouchesRef.current;
    for (let i = 0; i < ongoingTouches.length; i++) {
      const id = ongoingTouches[i].identifier;
      if (id === idToFind) {
        return i;
      }
    }
    return -1; // not found
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
    <div className='mt-12'>
    <div className='flex flex-row items-center mb-3 '>
      <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
        <button onClick={handleImageUpload} className='mr-2 bg-slate-900 text-white py-2 px-3 rounded-full flex flex-row items-center shadow-xl'><PiImageFill className='text-md mr-1'/> <p className='text-sm'>Upload Image</p></button>
        {/* <button className='mr-1 bg-slate-900 text-white p-2 text-lg rounded-full flex flex-row items-center shadow-xl'><MdDelete /></button> */}
       
        <button onClick={handleSaveImage} className={`mr-2 bg-slate-900 text-white py-2 px-3 text-lg rounded-full flex flex-row items-center shadow-xl`}><RxMaskOn className='text-md mr-1'/><p className='text-sm'>Save Mask</p></button>
        {/* <button className='mr-1 bg-slate-900 text-white p-2 text-lg rounded-full flex flex-row items-center shadow-xl'><MdDelete /></button> */}
        
        <button onClick={MagicTransform} className='mr-2 bg-slate-900 text-white py-2 px-3 text-lg rounded-full flex flex-row items-center shadow-xl'><RxMagicWand className='text-md mr-1' /><p className='text-sm'>Transform Image</p></button>

    </div>

      {initImage && (
        <div
          style={{
            width: '512px',
            height: '512px',
            backgroundImage: `url(${initImage})`,
            backgroundSize: 'cover',
            position: 'relative',
          }}
          className='rounded-lg'
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

    </div>
  );
}

export default DrawingOnImage;
