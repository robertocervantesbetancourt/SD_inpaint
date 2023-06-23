import React, { useEffect, useRef, useState } from 'react';

const DrawingMobile = ({ InitialImage, TheMask }) => {
  const canvasRef = useRef(null);
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);
  const ongoingTouchesRef = useRef([]);
  const [initImage, setInitImage] = useState(null);

  // const handleImageUpload = (event) => {
  //   InitialImage(event.target.files[0]);
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     setInitImage(reader.result);
  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageUpload = (event) => {
    
    const file = event.target.files[0];
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
        const file = new File([blob], 'drawing.jpg', { type: 'image/jpeg' });
    
        InitialImage(file);
  
        setInitImage(resizedImageUrl);
        
      };
  
      image.src = reader.result;
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
    const context = canvas.getContext('2d');
    const viewport = window.visualViewport;

    function startup() {
      canvas.addEventListener('touchstart', handleStart);
      canvas.addEventListener('touchend', handleEnd);
      canvas.addEventListener('touchcancel', handleCancel);
      canvas.addEventListener('touchmove', handleMove);
    }

    function handleStart(evt) {
      evt.preventDefault();
      const touches = evt.changedTouches;
      offsetXRef.current = canvas.getBoundingClientRect().left;
      offsetYRef.current = canvas.getBoundingClientRect().top;
      for (let i = 0; i < touches.length; i++) {
        ongoingTouchesRef.current.push(copyTouch(touches[i]));
      }
    }

    function handleMove(evt) {
      evt.preventDefault();
      const touches = evt.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        const idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
          context.beginPath();
          context.moveTo(ongoingTouchesRef.current[idx].clientX - offsetXRef.current, ongoingTouchesRef.current[idx].clientY - offsetYRef.current);
          context.lineTo(touches[i].clientX - offsetXRef.current, touches[i].clientY - offsetYRef.current);
          context.lineWidth = 40;
          context.strokeStyle = '#FFFFFF';
          context.lineJoin = "round";
          context.lineCap = 'round';
          context.closePath();
          context.stroke();
          ongoingTouchesRef.current.splice(idx, 1, copyTouch(touches[i]));
        }
      }
    }

    function handleEnd(evt) {
      evt.preventDefault();
      const touches = evt.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
          context.lineWidth = 40;
          context.fillStyle = '#000000';
          ongoingTouchesRef.current.splice(idx, 1);
        }
      }
    }

    function handleCancel(evt) {
      evt.preventDefault();
      const touches = evt.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouchesRef.current.splice(idx, 1);
      }
    }

    function copyTouch({ identifier, clientX, clientY }) {
      return { identifier, clientX, clientY };
    }

    function ongoingTouchIndexById(idToFind) {
      for (let i = 0; i < ongoingTouchesRef.current.length; i++) {
        const id = ongoingTouchesRef.current[i].identifier;
        if (id === idToFind) {
          return i;
        }
      }
      return -1;
    }

    startup();

    return () => {
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchend', handleEnd);
      canvas.removeEventListener('touchcancel', handleCancel);
      canvas.removeEventListener('touchmove', handleMove);
    };
    }
  }, []);

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
    <>
    <input type="file" accept="image/*" onChange={handleImageUpload} /> 
    {initImage &&
    <>
    <div
          style={{
            width: '512px',
            height: '512px',
            backgroundImage: `url(${initImage})`,
            backgroundSize: 'cover',
            position: 'relative',
          }}
        >
      <canvas ref={canvasRef} id="canvas" width="512" height="512"></canvas>
    </div>
    <button onClick={handleSaveImage} className="bg-blue-400 p-2 rounded">
          Save Mask
    </button>
    </>
}
    </>
  );
};

export default DrawingMobile;
