
"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `import express from"express"
import cors from "cors"
import morgan from "morgan"
import mongoose  from "mongoose"
import PlayerModel from "./models/PlayerSchema.js"
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

async function connectToMongoDB(){
    try {
        mongoose.set("bufferCommands",false);
        mongoose.set("strictQuery",true);
        const mongoDB = "mongodb://127.0.0.1/Sprawdzian"
        await mongoose.connect(mongoDB, {
            dbName:"Baza",
        })
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
        process.exit(-1);
    }
}

connectToMongoDB()
app.listen(5000,()=>{
    console.log("Dziala")
})
app.post("/api/zad1/",async(req,res)=>{
    const {params} = req.body
    const data = await PlayerModel.find({
        club:params
    })
    res.json(data)
})
app.post("/api/zad2",async(req,res)=>{
    const {params} = req.body
    const data = await PlayerModel.find({
        position:params
    })
    res.json(data)
})
app.post("/api/zad3",async(req,res)=>{
    const {params} = req.body
    const data = await PlayerModel.find({
        goals:{$gte:parseInt(params)}
    })
    res.json(data)
})
app.post("/api/zad4",async(req,res)=>{
const {params} = req.body
    const data = await PlayerModel.aggregate([
        {
            $sort:{goals:-1}
        },
        {
            $limit:parseInt(params)
        }
    ])
    res.json(data)
})
app.get("/api/zad5",async(req,res)=>{
     const data = await PlayerModel.aggregate([
        {
            $group:{
                _id:"$position",
                gole:{$avg:"$goals"},
                pilkarze:{$count:{}}
            }
        }
    ])
    res.json(data)
})
app.get("/api/zad6",async(req,res)=>{
 const data = await PlayerModel.aggregate([
        {
            $group:{
                _id:"$club",
                lacznaPensja:{$sum:"$salary"},
            }
        }
    ])
    res.json(data)
})
app.get("/api/zad7",async(req,res)=>{
 const data = await PlayerModel.aggregate([
        {
            $group:{
                _id:"$club",
                sumaGoli:{$sum:"$goals"},
            }
        },
        {
            $sort:{
                sumaGoli:-1
            }
        }
    ])
    res.json(data)
})
app.post("/api/zad8",async(req,res)=>{
    const {params} = req.body
    const data = await PlayerModel.aggregate([
        {
            $match:{
                age:{$gt:params}
            }
        },
        {
            $group:{
                _id:"$league",
                age:{$first:"$age"},
                sredniaWartoscRynkowa:{$sum:"$salary"}
            }
        }
    ])
    res.json(data)
})
app.post("/api/zad9",async(req,res)=>{
const {params} = req.body
    const data = await PlayerModel.aggregate([
        {
            $match:{
                position:params
            }
        },
        {
            $group:{
                _id:"$marketValue",
                name:{$first:"$name"}
            }
        },
        {
            $sort:{
                _id:-1
            }
        }
        ,{
            $limit:1
        }
    ])
    res.json(data)
})
app.post("/api/zad10",async(req,res)=>{
const {params} = req.body

const data = await PlayerModel.aggregate([
    {
            $match:{
                club:params
            }
        },
        {
            $group:{
                _id:"$club",
                clubName:{$first:"$club"},
                liczbaZawodnikow:{$count:{}},
                lacznaLiczbaGoli:{$sum:"$goals"},
                lacznaLiczbaAsyst:{$sum:"$assists"},
                sredniWiek:{$avg:"$age"},
            }
        },
    ])
    res.json(data)
})


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