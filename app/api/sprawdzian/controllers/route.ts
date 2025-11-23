"use server";

import { NextResponse } from "next/server";


export async function GET() {

    const data = `import ReservationsModel from "../models/reservationModel.js"

export const getReservations =async(req,res)=>{
    const data = await getReservationsHelper();
    res.status(200).json(data)
}
async function getReservationsHelper(){
    try {
        const data = await ReservationsModel.find()
        return data
    } catch (error) {
       return []
    }
}
export const filterTest =async(req,res)=>{
    // const data = await ReservationsModel.find({

        // $or:[]
            // organizer:"Jan Paweł",
            // reservationID:{$gt:2}
            // id:{$gt:2}
            // organizer:{$regex:/^J/} // zaczyna sie na B
            // organizer:{$regex:/B$/} // konczy sie na B
            // $expr:{$gte:[{$strLenCP:"$organizer"},14]} - dlugosc organizera wieksza od 14
            // $or:[
            //     {organizer:{$regex:/^J/}},
            //     {organizer:{$regex:/^K/}}
            // ]
            // roomName:{$in:["A","B"]}
            // reservationID:{$gte:2,$lte:5} - przedzial
            // reservationID:{$ne:4} - wszystko oprocz
            // $and:[{reservationID:{$gte:2}},{organizer:{$regex:/^J/}},{roomName:{$ne:"A"}}]
            // $and:[{$or:[{reservationID:{$gte:5}},{organizer:{$regex:/^J/}}]},{roomName:{$ne:"B"}}]


        // },
        // ktore pola ma wyswietlic
        // {organizer:1,reservationID:1}
    // )
    // agregacje
    const data = await ReservationsModel.aggregate([
        // {
        //     $group:{
        //         _id:null,
        //         // srednieID:{$avg:"$reservationID"}
        //         // srednieID:{$sum:"$reservationID"}
        //     }
        // }
        // {
        //     $group:{
        //         _id:"$time",
        //         srednieID:{$avg:"$reservationID"},
        //         ilePracownikow:{$count:{}}
        //     }
        // }
        
            {
              $group: {
                _id: "$time",
                minimalnaID: { $sum: "$reservationID" },
                ilePracownikow: { $sum: 1 }
              }
            },
            {
                $match:{ilePracownikow:{$gt:1}}
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
            }
          ]);
    console.log(data)
    res.json([]).status(200)
}
export const addReservation =async (req,res)=>{
    const data = req.body
    const allObjects= await getReservationsHelper()
    var obj = {
        reservationID:allObjects.length+1,
        roomName:data.roomName,
        organizer:data.organizer,
        date:data.date,
        time:data.time,
    }
    try {
        await ReservationsModel.create(obj)
        res.status(200).json({message:"Everything fine"})
    } catch (error) {
        res.status(404).json({message:"Couldn't add reservation"})
    }
}
/*
$gt - wieksze od
$lt - mniejsze od
$gte - wieksze lub rowne
$lte - mniejsze lub rowne
$ne - nie rowne

*/
export const getReservationsByNumber =async(req,res)=>{
    const {room} = req.params
    try {
        const data = await ReservationsModel.find({roomName:room})
        res.status(200).json(data)
    } catch (error) {
        res.status(404).json({message:"Couldn't fetch reservations"})
    }
}`
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