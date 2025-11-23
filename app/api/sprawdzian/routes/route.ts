"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `import { Router } from "express";
import { addReservation, getReservations, getReservationsByNumber,filterTest } from "../controlers/functions.js";
const router = Router()
router.get("/api/reservations",getReservations);
router.post("/api/reservations",addReservation);
router.get("/api/reservations/:room",getReservationsByNumber)
router.get("/api/filter",filterTest)
export default router`
    const res = NextResponse.json({data});
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  
  return res;
}

export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
  
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  
    return response;
  }