const { GoogleGenAI } = require('@google/genai');

const generateMessage = async (formData) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in environment variables');
  }

  // Initialize the SDK
  const ai = new GoogleGenAI({ apiKey });

  const customer = formData.customerName || 'Valued Customer';
  const trip = formData.tripType || 'Tour';
  const driver = formData.driverName || 'our driver';
  const link = formData.reviewLink || 'https://g.page/r/xxxx/review';
  const notes = formData.experienceNotes ? formData.experienceNotes.trim() : '';

  let promptText = `You are a professional customer success manager for "Manivtha Tours & Travels". 
Your task is to write a warm, personalized, and unique "Thank You" message to a customer after their trip.
Do not use a rigid template. Be creative, natural, and friendly, but keep it professional and concise.

DETAILS:
- Customer Name: ${customer}
- Trip Type/Destination: ${trip}
- Driver's Name: ${driver}`;

  if (notes) {
    promptText += `\n- Customer's Experience Notes: "${notes}"
(CRITICAL: Make sure to explicitly mention and weave these notes naturally into the message to show we listened to their feedback.)`;
  }

  promptText += `\n- Google Review Link: ${link}

REQUIREMENTS:
1. Start with a warm greeting to the customer.
2. Thank them for choosing Manivtha Tours & Travels for their trip.
3. Mention their driver by name.
4. Smoothly integrate their experience notes if provided. If no notes are provided, just express general gratitude for their journey.
5. Politely ask them to leave a review using the provided Google Review Link.
6. Sign off warmly as "Manivtha Tours & Travels".
7. Do NOT include any placeholder text or brackets. Output the final ready-to-send message directly without extra markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    });

    let generatedText = response.text;
    
    if (!generatedText) {
      throw new Error('Empty response from Google Gemini API');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate message directly from Gemini');
  }
};

module.exports = {
  generateMessage
};
