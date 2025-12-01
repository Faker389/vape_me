
"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./Routes/products.js");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Połączenie z MongoDB
mongoose
  .connect("mongodb://localhost:27017/produktyDB")
  .then(() => console.log("Połączono z MongoDB"))
  .catch(err => console.error("Błąd połączenia:", err));

// Routy
app.use("/products", productRoutes);

// Start serwera
const PORT = 3000;
app.listen(PORT, () => {
  console.log(Server działa na http://localhost:3000);
});
`

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