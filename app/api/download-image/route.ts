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

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return new Response(response.data, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}