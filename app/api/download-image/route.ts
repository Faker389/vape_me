"use server";
import { NextResponse } from "next/server";
import axios from "axios";
import admin from "firebase-admin";
if (!admin.apps.length) {
  admin.initializeApp({
    credential:   admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_project_id,
      privateKey: process.env.NEXT_PUBLIC_private_key?.replace(/\\n/g, '\n'),
      clientEmail: process.env.NEXT_PUBLIC_client_email,
    }),
  });
}
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const idToken = authHeader.replace("Bearer ", "");
  try {
    await admin.auth().verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: "Missing image URL" }, { status: 400 });

  // Security: Validate URL format to prevent SSRF attacks
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  // Only allow HTTPS URLs
  if (parsedUrl.protocol !== "https:") {
    return NextResponse.json({ error: "Only HTTPS URLs are allowed" }, { status: 400 });
  }

  // Block private/internal IPs (SSRF protection)
  const hostname = parsedUrl.hostname;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.16.") ||
    hostname.startsWith("172.17.") ||
    hostname.startsWith("172.18.") ||
    hostname.startsWith("172.19.") ||
    hostname.startsWith("172.20.") ||
    hostname.startsWith("172.21.") ||
    hostname.startsWith("172.22.") ||
    hostname.startsWith("172.23.") ||
    hostname.startsWith("172.24.") ||
    hostname.startsWith("172.25.") ||
    hostname.startsWith("172.26.") ||
    hostname.startsWith("172.27.") ||
    hostname.startsWith("172.28.") ||
    hostname.startsWith("172.29.") ||
    hostname.startsWith("172.30.") ||
    hostname.startsWith("172.31.") ||
    hostname === "0.0.0.0"
  ) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    // Set timeout and max content length to prevent DoS
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 10000, // 10 second timeout
      maxContentLength: 10 * 1024 * 1024, // 10MB max
      maxBodyLength: 10 * 1024 * 1024,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    // Validate content type
    const contentType = response.headers["content-type"] || "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "URL does not point to an image" }, { status: 400 });
    }

    return new Response(response.data, {
      headers: { 
        "Content-Type": contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("Image download error:", err.message);
    return NextResponse.json({ error: "Failed to download image" }, { status: 500 });
  }
}