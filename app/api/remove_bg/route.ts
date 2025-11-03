// pages/api/remove-bg.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: "No image URL provided" });

    const apiKey = process.env.REMOVE_BG_KEY; // add in your .env
    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      { image_url: imageUrl, size: "auto" },
      { headers: { "X-Api-Key": apiKey }, responseType: "arraybuffer" }
    );

    res.setHeader("Content-Type", "image/png");
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove background"+err });
  }
}
