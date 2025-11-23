"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `import mongoose from "mongoose";
const reservationSchema = new mongoose.Schema(
    {
        reservationID:{type:Number,required:true},
        roomName:{type:String,required:true,trim:true},
        organizer:{type:String,required:true,trim:true},
        date:{type:String,required:true,trim:true},
        time:{type:String,required:true,trim:true},
    },
    {
        timestamps:{
            createdAt:"created_at",
            updatedAt:"updated_at"
        },
        collation:'reservations'
    }
)
const ReservationsModel = mongoose.model("reservations",reservationSchema,"reservations");

export default ReservationsModel`
    const res = NextResponse.json({data});

  return res;
}
