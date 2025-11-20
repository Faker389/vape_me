"use server";

import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Initialize Firebase Admin once
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

// Max emails per browser per day
const MAX_EMAILS_PER_DAY = 3;

export async function POST(req: NextRequest) {
  const { email, name, subject, message } = await req.json();

  if (!email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // ——————————————————————
  // 1. Get browser ID (stored in cookie)
  // ——————————————————————
  let browserID = req.cookies.get("browser_id")?.value;

  if (!browserID) {
    browserID = crypto.randomUUID();
  }

  // Hash the browser ID before storing it
  const hashed = crypto.createHash("sha256").update(browserID).digest("hex");

  // ——————————————————————
  // 2. Check rate limit
  // ——————————————————————
  const ref = db.collection("contactRateLimits").doc(hashed);
  const snap = await ref.get();

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  let count = 0;
  let lastReset = now;

  if (snap.exists) {
    const data = snap.data()!;
    count = data.count;
    lastReset = data.lastReset;
  }

  // Reset daily
  if (now - lastReset >= oneDay) {
    count = 0;
  }

  if (count >= MAX_EMAILS_PER_DAY) {
    return NextResponse.json(
      { error: "Too many messages. Try again tomorrow." },
      { status: 429 }
    );
  }

  // ——————————————————————
  // 3. Send email using Admin SDK (or nodemailer)
  // ——————————————————————

  // Example using Firebase Admin (works only with real SMTP config)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
    port: Number(process.env.SMTP_PORT), // e.g. 465
    secure: true, // true for port 465
    auth: {
      user: process.env.SMTP_USER, // your email login
      pass: process.env.SMTP_PASS, // your email password / app password
    },
  });

  // 2. Prepare email
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.RECEIVER_EMAIL, 
    subject: `Contact Form: ${subject}`,
    text: `
From: ${name}
Email: ${email}

Message:
${message}
    `,
  };

  // 3. Send email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Email sending failed" },
      { status: 500 }
    );
  }

  // ——————————————————————
  // 4. Increase usage count
  // ——————————————————————
  await ref.set({
    count: count + 1,
    lastReset: now,
  });

  // ——————————————————————
  // 5. Return response with cookie
  // ——————————————————————
  const res = NextResponse.json({ success: true });

  // Set browser ID cookie (long-term)
  res.cookies.set("browser_id", browserID, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return res;
}
