import React, { useEffect, useRef, useState } from 'react';

const DrawingMobile = ({ InitialImage, TheMask }) => {
  const canvasRef = useRef(null);
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);
  const ongoingTouchesRef = useRef([]);
  const [initImage, setInitImage] = useState(null);

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
        const color = document.getElementById('selColor').value;
        const idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
          context.beginPath();
          context.moveTo(ongoingTouchesRef.current[idx].clientX - offsetXRef.current, ongoingTouchesRef.current[idx].clientY - offsetYRef.current);
          context.lineTo(touches[i].clientX - offsetXRef.current, touches[i].clientY - offsetYRef.current);
          context.lineWidth = 40;
          context.strokeStyle = '#000000';
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
        const color = document.getElementById('selColor').value;
        let idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
          context.lineWidth = document.getElementById('selWidth').value;
          context.fillStyle = color;
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

    const clearArea = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
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

  return (
    <>
    <input type="file" accept="image/*" onChange={handleImageUpload} />
    <div id="canvas_div" style={{ textAlign: 'center', display: 'block', marginLeft: 'auto', marginRight: 'auto', backgroundImage: `url(${initImage})`, backgroundSize: 'cover' }}>
      <canvas ref={canvasRef} id="canvas" width="512" height="512"></canvas>
      Line width :
      <select id="selWidth">
        <option value="11">11</option>
        <option value="13" selected="selected">13</option>
        <option value="15">15</option>
      </select>
      Color :
      <select id="selColor">
        <option value="black">black</option>
        <option value="blue" selected="selected">blue</option>
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="yellow">yellow</option>
        <option value="gray">gray</option>
      </select>
    </div>
    {/* {initImage && (
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
          ></canvas>
        </div>
      )} */}
    </>
  );
};

export default DrawingMobile;
