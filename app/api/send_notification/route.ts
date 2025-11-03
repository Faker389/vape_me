"use server"
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin once
if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "vapeme-61377",
        clientEmail: "firebase-adminsdk-fbsvc@vapeme-61377.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6++JiCmPBrhvV\nLWfogz+lC3IhSJ9zQtx47qPhX235dHu/HvKO3+nLQsKQK/SZq0C2sAKFdPu8A0VN\nPAozwG4yhWqKU3FpCUoLluPaRtb1oCQgFoaFAgx+A+KKFLZng0kFiT9rVbiEvZNf\nHC+Qqr2t96TQ23Kf0ESsxXYV2Z2Vluv0a8KZWnpZKgCanBrwE+Bqvqimodvh/I3V\nYWQNlv+5krDIZMcQpuysVBtuHNQzuYw58buJcO3sRqWrdu371CPRCL1tGRxbAgJa\nlKBrlYpNZe80aZHqhYsb0iyc+WZVswYODUnsOzSNJ2EC/saJLyf+qObOLJD1utl3\nUwfoRA0DAgMBAAECggEAFK3my5D6l2D6EwmChGR/lXE+ng+6ErVCTN2XokU7lGsd\nhHWXvdVlteUcP3WdB6G49ntgzAG0FYcHExOgzThq94tpzQKNeGBeoAmACZPsEh4z\n4JidJ/iiCQ3E8CB6S9hpKwOSz/wa/BM7STmEySsY7zSENdUPSD1wWus7tA7tLq3h\nzeaxJ888tB1EuIeMsEid0KDXatVnEawS3FhPV2W0gmkxbZZdGvwwc4W/iqOxz/gp\nghMNw0ZpLg+vKhAcjkLcbT/0jVf7YoIV/dWfBZ5G5WltCLAu88C6DU1KLwBwYeSr\nUULzgR000Q9r2JXcngHFZj3qb6BdRxKbnu4h0sdZAQKBgQDoytsVz5pUHmqdvBtY\n/RPcUztA4o2W1TZmNQwXWgEvH68Q/GGceeIYw0JL+XpfwoZei+DhOYTxQnrURFJP\nq9o9Bnv3xZYYQ7tXXm117L0SH/3USYEMXhJXPk4tA9mKomMMCtBiUugbchqbvuDI\nDiUZ+U8YmHXBs+lKnl+T3WehiQKBgQDNn/DHZtco78yjFpTq7SlWReaVIN8Uw8Mr\nSOjy24fU1d+IYzCQQ14jCaCtiN1aUTNop/iO7XF7F66Hl8ThDeCon7p7uAXQ3AcS\n+FojUSqJAC+Bse3nLPSxZFIA2/+rBILvoYh2blmriIikNMxuzZqbBKsot0+AcUr2\nxoXLCfjTKwKBgChZGJX0MJyJ1RLXyqmm261hY7DAU6gj9lTKtvjJKdFgHXjFNano\nWi7OkQwYBoTYc2+psOV4kbk7O4zU9qtGbwIKwKvWPEiiXLMs863vxWmBz/3ea5aY\nK3ehne0hcLAdqysoKKwSEJbJNSFveQhTo0yYMIRj0G0tYK8FOi2nv1F5AoGAWTTa\nMKfdEFV4YgiZ8pGRLWyF7IymO0vykATBixrSgvOGVpUxrGSNooW6v45w+Y3gz7aP\njvJUGSLdBNZDA6ARpxYkwSfE3ieWqhQ0hr3fxi/ebFXU8EYAojTznovTD06Vv4BE\nw5x8Kn7BSPve9PMd78LGvpNIWmDMNONLiBp7aKECgYEAqjru1MjPHhRwlKBpNh2O\n00kmyEsWCnsUBzPj37Q5xrrFZ2ZyArpAW0us9fjQy8J3x1Ds7EtNdmiQ8mUPpOG8\ndxCnBTjGxmidzH3nQAyNrhZOnLElLYVbUPptuLm7JDIleuxwYgv43N8qbFqnylgI\nLoXLOei6L2ze7QA1XRQpBtc=\n-----END PRIVATE KEY-----\n", 
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
