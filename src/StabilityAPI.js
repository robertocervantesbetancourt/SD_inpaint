import axios from 'axios';

const StabilityAPI = async (initImage, maskImage, prompt) => {

  // const AUTH_TOKEN = "sk-LtUQO8SfZb4WYeoWuLO1VJ9jXpTzo2brGWzG4cfdgroHw9iC"
  const AUTH_TOKEN = process.env.REACT_APP_SD_TOKEN
  const LINK = "https://api.stability.ai/v1/generation/stable-inpainting-512-v2-0/image-to-image/masking"

  try {
    const formData = new FormData();
    formData.append('init_image', initImage);
    formData.append('mask_image', maskImage);
    formData.append('mask_source', 'MASK_IMAGE_WHITE');
    formData.append('text_prompts[0][text]', prompt);
    formData.append('cfg_scale', '7');
    formData.append('clip_guidance_preset', 'FAST_BLUE');
    formData.append('samples', '1');
    formData.append('steps', '30');

    const response = await axios.post(LINK, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'image/png',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      responseType: 'blob',
    });

    return new Blob([response.data], { type: 'image/png' });

    // const url = window.URL.createObjectURL(new Blob([response.data]));
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', 'v1_img2img_masking.png');
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // return true;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export default StabilityAPI;
