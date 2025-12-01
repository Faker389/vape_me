

"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `const express = require("express");
    const router = express.Router();
    const { filterProducts } = require("../kontroler/ProduktKontroler.js");
    
    router.get("/filter", filterProducts);
    
    module.exports = router;`

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