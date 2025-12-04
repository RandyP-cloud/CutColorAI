import Replicate from "replicate";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    // Increase timeout setting for Vercel Pro users (doesn't hurt Free users)
    maxDuration: 60, 
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    console.error("Replicate Token missing on server");
    return res.status(500).json({ error: "Server Error: Missing API Key" });
  }

  const replicate = new Replicate({
    auth: token,
  });

  try {
    const { prompt, image } = req.body;

    if (!prompt || !image) {
      return res.status(400).json({ error: "Missing prompt or image" });
    }

    console.log("Starting generation with SDXL Lightning...");

    // Switched to SDXL Lightning (4-step) for <3 second generation
    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:727e49a643e999d602a896c774a01d74f0436936cbf1672322d7a22df9557436",
      {
        input: {
          prompt: prompt,
          image: image,
          strength: 0.75, 
          negative_prompt: "distorted face, plastic skin, changed background, blur, low quality, bad anatomy, extra fingers, missing limbs, unnatural colors, wig-like texture, oversaturated, painting, cartoon, doll",
          num_inference_steps: 4, // Extremely fast
          guidance_scale: 0 // Lightning specific setting
        }
      }
    );

    console.log("Generation successful:", output);
    
    // Check if output is valid
    if (!output || !output[0]) {
        throw new Error("Replicate returned empty output");
    }

    res.status(200).json({ output: output[0] });

  } catch (error) {
    console.error("Replicate Error:", error);
    // Return the actual error message so you can see it in the browser console
    res.status(500).json({ error: "Generation Failed", details: error.message });
  }
}