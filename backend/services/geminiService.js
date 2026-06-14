const axios = require('axios');

const generateMessage = async (formData) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in environment variables');
  }

  const customer = formData.customerName || 'Valued Customer';
  const trip = formData.tripType || 'Tour';
  const driver = formData.driverName || 'our driver';
  const notes = formData.experienceNotes || 'the excellent service';
  const link = formData.reviewLink || 'https://g.page/r/xxxx/review';

  const promptText = `You are a professional assistant. Output EXACTLY the following message, replacing the bracketed placeholders with the details provided. Do not add any extra text, greetings, or formatting.

DETAILS:
- Customer: ${customer}
- Trip: ${trip}
- Driver: ${driver}
- Notes: ${notes}
- Link: ${link}

MESSAGE TO OUTPUT:
Hi [Customer],

Thank you for choosing Manivtha Tours & Travels for your [Trip].

We're delighted to hear that you appreciated [Notes] during your journey with our driver, [Driver].

Your feedback means a lot to us and helps us continue providing excellent service.

We would greatly appreciate it if you could take a moment to leave us a Google review:

[Link]

Thank you for travelling with us, and we look forward to serving you again.

Warm regards,
Manivtha Tours & Travels`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: promptText
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    let generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('Empty response from Google Gemini API');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate message directly from Gemini');
  }
};

module.exports = {
  generateMessage
};
