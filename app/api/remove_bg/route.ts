import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    const apiKey = process.env.REMOVE_BG_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing REMOVE_BG_KEY in environment" }, { status: 500 });
    }

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      { image_url: imageUrl, size: "auto" },
      { headers: { "X-Api-Key": apiKey }, responseType: "arraybuffer" }
    );

    return new NextResponse(response.data, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to remove background" }, { status: 500 });
  }
}
