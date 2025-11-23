"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `import router from "./routes/routes.js";
import cors from "cors"
import express from "express"
import mongoose  from "mongoose";
import morgan from "morgan";
const app = express();
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use("/",router)

async function connectToMongoDB(){
    try {
        mongoose.set("bufferCommands",false);
        mongoose.set("strictQuery",true);
        const mongoDB = "mongodb://127.0.0.1/Reservations"
        await mongoose.connect(mongoDB, {
            dbName:"Reservations",
        })
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}
connectToMongoDB()
app.listen(1944,()=>{
    console.log("Dziala")
})`
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