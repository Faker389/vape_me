import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    
    const apiKey = process.env.REMOVE_BG_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing REMOVE_BG_KEY" },
        { status: 500 }
      );
    }

    let requestBody;
    let headers: Record<string, string> = {
      "X-Api-Key": apiKey,
    };

    // Handle file upload (multipart/form-data)
    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "Missing file" },
          { status: 400 }
        );
      }

      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString("base64");

      requestBody = {
        image_file_b64: base64Image,
        size: "auto",
      };
      headers["Content-Type"] = "application/json";
    } 
    // Handle URL (application/json)
    else {
      const { imageUrl } = await req.json();

      if (!imageUrl) {
        return NextResponse.json(
          { error: "Missing imageUrl" },
          { status: 400 }
        );
      }

      // Validate URL format
      if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 }
        );
      }

      requestBody = {
        image_url: imageUrl,
        size: "auto",
      };
      headers["Content-Type"] = "application/json";
    }

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      requestBody,
      {
        headers,
        responseType: "arraybuffer",
      }
    );

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error: any) {
    // Decode error buffer if present
    let errorMessage = "Failed to remove background";
    
    if (error.response?.data) {
      try {
        const errorText = Buffer.from(error.response.data).toString('utf-8');
        console.error("RemoveBG API Error:", errorText);
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.errors?.[0]?.title || errorMessage;
      } catch (e) {
        console.error("RemoveBG Error:", error);
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: 500 }
    );
  }
}