
"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `const data = await ReservationsModel.find({
            $or:[]
            organizer:"Jan Paweł",
            reservationID:{$gt:2}
            id:{$gt:2}
            organizer:{$regex:/^J/} // zaczyna sie na B
            organizer:{$regex:/B$/} // konczy sie na B
            $expr:{$gte:[{$strLenCP:"$organizer"},14]} - dlugosc organizera wieksza od 14
            $or:[
                {organizer:{$regex:/^J/}},
                {organizer:{$regex:/^K/}}
            ]
            roomName:{$in:["A","B"]}
            reservationID:{$gte:2,$lte:5} - przedzial
            reservationID:{$ne:4} - wszystko oprocz
            $and:[{reservationID:{$gte:2}},{organizer:{$regex:/^J/}},{roomName:{$ne:"A"}}]
            $and:[{$or:[{reservationID:{$gte:5}},{organizer:{$regex:/^J/}}]},{roomName:{$ne:"B"}}]


        },
        ktore pola ma wyswietlic
        {organizer:1,reservationID:1}
    )`

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