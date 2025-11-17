"use server"
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin once
if (!admin.apps.length) {
    admin.initializeApp({
      credential:   admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_project_id,
        privateKey: process.env.NEXT_PUBLIC_private_key,
        clientEmail: process.env.NEXT_PUBLIC_client_email,
      }),
    });
  }

export async function POST(req: NextRequest) {
  const { fcmToken, title, body, priority } = await req.json();
    console.log({ fcmToken, title, body, priority })
  if (!fcmToken || !title || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const message: admin.messaging.Message = {
    token: fcmToken,
    notification: { title, body },
    android: { priority: priority === "high" ? "high" : "normal" },
  };

  try {

    const response = await admin.messaging().send(message);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
