"use server"
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_project_id,
        privateKey: process.env.NEXT_PUBLIC_private_key?.replace(/\\n/g, '\n'),
        clientEmail: process.env.NEXT_PUBLIC_client_email,
          }),
    });
  }
  const db = admin.firestore();

  
  export async function POST(req: NextRequest) {
    const { title, body, priority, notificationType } = await req.json();
  
    if (!title || !body || !priority || !notificationType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
  
    try {
      const usersSnapshot = await db.collection("users").get();
  
      const sendPromises: Promise<string>[] = [];
  
      usersSnapshot.forEach((doc) => {
        const user = doc.data();
  
        if (
          user.notifications?.pushNotifications &&
          user.notifications[notificationType]
        ) {
          if (user.token) {
            const message: admin.messaging.Message = {
              token: user.token,
              notification: { title, body },
              android: { priority: priority === "high" ? "high" : "normal" },
            };
            // Push directly using Firebase Admin
            sendPromises.push(
              admin.messaging().send(message)
            );
          }
        }
      });
  
      const responses = await Promise.all(sendPromises);
  
      return NextResponse.json({
        success: true,
        message: `Notifications sent to ${responses.length} users.`,
        responses,
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      return NextResponse.json(
        { success: false, error },
        { status: 500 }
      );
    }
  }