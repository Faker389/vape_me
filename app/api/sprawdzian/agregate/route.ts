"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = ` const data = await ReservationsModel.aggregate([
        {
            $match:{ilePracownikow:{$gt:1}}
        },
            {
              $group: {
                _id: "$time",
                minimalnaID: { $sum: "$reservationID" },
                ilePracownikow: { $count: {} }
              }
            },
           
            {
              $sort: { minimalnaID: 1 } // 1 rosnaco -1 malejaco
              
            },
            {
                $project:{
                    _id:0, // wywietlanie 1- true 0 - false
                    minimalnaID:1,
                    ilePracownikow:1    
                }
            },{
                $limit:2
            }
          ]);`

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