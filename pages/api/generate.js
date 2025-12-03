import Replicate from "replicate";

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

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    console.error("Replicate Token missing on server");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const replicate = new Replicate({
    auth: token,
  });

  try {
    const { prompt, image } = req.body;

    if (!prompt || !image) {
      return res.status(400).json({ error: "Missing prompt or image" });
    }

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          image: image,
          strength: 0.75,
          negative_prompt: "distorted face, plastic skin, changed background, blur, low quality, bad anatomy, extra fingers, missing limbs, unnatural colors, wig-like texture, oversaturated, painting, cartoon, doll",
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      }
    );

    res.status(200).json({ output: output[0] });

  } catch (error) {
    console.error("Replicate Error:", error);
    res.status(500).json({ error: "Generation Failed", details: error.message });
  }
}