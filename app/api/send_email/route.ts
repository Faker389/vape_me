"use server";

import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import crypto from "crypto";

// Init Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential:   admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_project_id,
      privateKey: process.env.NEXT_PUBLIC_private_key?.replace(/\\n/g, '\n'),
      clientEmail: process.env.NEXT_PUBLIC_client_email,
    }),
  });
}

const db = admin.firestore();

// Max messages per browser per day
const MAX_MESSAGES_PER_DAY = 3;

export async function POST(req: NextRequest) {
  const { title, message } = await req.json();
  if (!title|| !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // -------------------------------------
  // 1. Identify browser using cookie
  // -------------------------------------
  let browserID = req.cookies.get("browser_id")?.value;

  if (!browserID) {
    browserID = crypto.randomUUID();
  }

  // Hash browserID before storing
  const hashedID = crypto
    .createHash("sha256")
    .update(browserID)
    .digest("hex");

  // -------------------------------------
  // 2. Rate limit check (3 per day)
  // -------------------------------------
  const limitRef = db.collection("contactRateLimits").doc(hashedID);
  const limitSnap = await limitRef.get();

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  let count = 0;
  let lastReset = now;

  if (limitSnap.exists) {
    const data = limitSnap.data()!;
    count = data.count || 0;
    lastReset = data.lastReset || now;
  }

  // Reset counter if 24h passed
  if (now - lastReset >= oneDay) {
    count = 0;
  }

  if (count >= MAX_MESSAGES_PER_DAY) {
    return NextResponse.json(
      { error: "Too many messages sent today." },
      { status: 429 }
    );
  }

  // -------------------------------------
  // 3. Store message in Firestore
  // -------------------------------------
  try {
    await db.collection("messages").add({
      id: crypto.randomUUID(),
      title,
      message,
      isRead:false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      browserHash: hashedID,
    });
  } catch (err) {
    console.error("Firestore error:", err);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }

  // -------------------------------------
  // 4. Increase daily count
  // -------------------------------------
  await limitRef.set({
    count: count + 1,
    lastReset: now,
  });

  // -------------------------------------
  // 5. Return response & set cookie
  // -------------------------------------
  const res = NextResponse.json({ success: true });

  res.cookies.set("browser_id", browserID, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return res;
}
