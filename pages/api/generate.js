export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key missing on server");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const { contents, systemInstruction, generationConfig } = req.body;

    if (!contents || !contents[0] || !contents[0].parts) {
      return res.status(400).json({ error: "Invalid payload structure" });
    }

    const cleanPayload = {
      contents,
      systemInstruction,
      generationConfig,
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanPayload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      return res.status(response.status).json({ error: "AI Generation Failed", details: errorData });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}