"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `import mongoose from "mongoose";
const serwisSchema = new mongoose.Schema(
    {
        zgloszeniaID:{type:Number,required:true},
        title:{type:String,required:true,trim:true},
        stat:{type:String,required:true,trim:true},
        prio:{type:String,required:true,trim:true},
        deadline:{type:Date,required:true,trim:true},
        progress:{type:Number, required:true},
        person:{type:String,required:true,trim:true}
    },
    {
        timestamps:{
            createdAt:"created_at",
            updatedAt:"updated_at"
        },
        collation:"serwis"
    }
)
const SerwisModel = mongoose.model("serwis",serwisSchema,"serwis");


export default SerwisModel`
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