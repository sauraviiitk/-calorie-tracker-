const ai = require('../config/gemini');
const fs = require('fs');

exports.analyzeImage = async (imagePath, mimeType = 'image/jpeg') => {
  try {
    const prompt = `Analyze this food image. Identify the food and estimate the following nutritional values in a strict JSON format exactly like this:
    {
      "name": "Food Name",
      "calories": 500,
      "protein": 20,
      "carbs": 50,
      "fat": 15
    }
    Do not include markdown blocks or any other text outside the JSON.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        prompt,
        {
          inlineData: {
            data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
            mimeType
          }
        }
      ]
    });
    
    const text = response.text;
    
    // Parse the JSON string from Gemini's response
    try {
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const nutritionalInfo = JSON.parse(jsonStr);
      return nutritionalInfo;
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text);
      throw new Error("Failed to parse nutritional data from image");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Failed to analyze food image with AI');
  }
};
