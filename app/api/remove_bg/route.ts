import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.REMOVE_BG_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing REMOVE_BG_KEY" }, { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const removeForm = new FormData();
    removeForm.append("image_file", buffer, "input.png");
    removeForm.append("size", "auto");

    const response = await axios.post("https://api.remove.bg/v1.0/removebg", removeForm, {
      headers: {
        ...removeForm.getHeaders(),
        "X-Api-Key": apiKey,
      },
      responseType: "arraybuffer",
    });

    return new NextResponse(response.data, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("❌ remove_bg error:", error);
    return NextResponse.json({ error: "Failed to remove background" }, { status: 500 });
  }
}
