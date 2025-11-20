"use server"
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NotificationsSettings, UserModel } from "@/lib/userModel";

// Initialize Firebase Admin once
if (!admin.apps.length) {
    admin.initializeApp({
      credential:   admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_project_id,
        privateKey: process.env.NEXT_PUBLIC_private_key?.replace(/\\n/g, '\n'),
        clientEmail: process.env.NEXT_PUBLIC_client_email,
      }),
    });
  }

export async function POST(req: NextRequest) {
  const { userID, title, body, priority,notificationType } = await req.json();
  if (!userID || !title || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const docSnap = await admin.firestore().collection("users").doc(userID).get();
  if(!docSnap.exists) return NextResponse.json({ error: "User not found" }, { status: 400 });
  const data = docSnap.data() as UserModel;
  if (
    !data.notifications?.pushNotifications 
  ){
    return NextResponse.json({ error: "No permissions" }, { status: 400 });
  }
  const message: admin.messaging.Message = {
    token: data.token!,
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
