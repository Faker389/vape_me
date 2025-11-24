"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `import cors from "cors"
import express from "express"
import mongoose from "mongoose";
import morgan from "morgan";
import SerwisModel from "./models/serwisModel.js";

const app = express();
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
async function getArr(){
    try{
        const data = await SerwisModel.find()
        return data
    }catch(error){
        return []
    }
}
app.get("/api/zgloszenia",async(req,res)=>{
    const data = await getArr();
    console.log(data)
    res.status(200).json(data)
    
})
app.post("/api/zgloszenia",async(req,res)=>{
    const data = req.body
    const allObj= await getArr()
    var obj = {
        zgloszeniaID:allObj.length+1,
        title:data.title,
        stat:data.stat,
        prio:data.prio,
        deadline:data.deadline,
        progress:data.progress,
        person:data.person
    }
    console.log(obj)

    try{
        await SerwisModel.create(obj)
        res.status(200).json({message: "Wszystko działa"})
    }catch(error){
        console.log(error)
        res.status(404).json({message:"Wystąpił błąd"})
        
    }
})
app.get("/api/zgloszenia/:pr",async(req,res)=>{
    const {pr} = req.params
    const parametr = pr.includes("redni")?"średni":pr
    if(pr=="wszystkie"){
        try{
        const data = await SerwisModel.find()
        res.status(200).json(data)
    }catch(error){
        res.status(404).json({message:"Wystąpił błąd z pobieraniem pr"})
    }
    return 
    }
    try{
        const data = await SerwisModel.find({stat:parametr})
        res.status(200).json(data)
    }catch(error){
        res.status(404).json({message:"Wystąpił błąd z pobieraniem pr"})
    }
})

async function connectToMongoDB(){
    try {
        mongoose.set("bufferCommands",false);
        mongoose.set("strictQuery",true);
        const mongoDB = "mongodb://127.0.0.1/serwis"
        await mongoose.connect(mongoDB, {
            dbName:"serwis",
        })
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
        process.exit(-1);
    }
    
}
connectToMongoDB()
app.listen(2750,()=>{
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