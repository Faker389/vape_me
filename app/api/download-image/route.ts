import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: "Missing image URL" }, { status: 400 });

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return new Response(response.data, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}