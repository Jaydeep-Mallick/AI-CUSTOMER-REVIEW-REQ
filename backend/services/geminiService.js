const axios = require('axios');

const generateMessage = async (formData) => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('N8N_WEBHOOK_URL is missing in environment variables');
  }

  try {
    const response = await axios.post(
      webhookUrl,
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Depending on your n8n workflow setup, the response might be formatted differently.
    // Assuming the n8n webhook returns {"message": "generated text"} or directly the text.
    console.log('n8n Webhook Response Data:', response.data);
    let generatedText = response.data?.message || response.data?.text || response.data;
    
    if (typeof generatedText === 'object') {
      // Fallback if n8n returns an unexpected JSON structure
      generatedText = JSON.stringify(generatedText);
    }
    
    if (!generatedText) {
      throw new Error('Empty response from n8n webhook');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('n8n Webhook Error:', error.response?.data || error.message);
    throw new Error('Failed to generate message from n8n workflow');
  }
};

module.exports = {
  generateMessage
};
