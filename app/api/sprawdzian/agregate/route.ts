"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = ` 
    $sum	sum values
$avg	average
$min	minimum
$max	maximum
$push	push values into array
$addToSet	push only unique values
$count	(in 5.0+) count documents
      {
  $group: {
    _id: "$country",
    totalUsers: { $sum: 1 },
    avgAge: { $avg: "$age" },
    youngest: { $min: "$age" },
    oldest: { $max: "$age" },
    allNames: { $push: "$name" },
    uniqueRoles: { $addToSet: "$role" }
  }
}

$concat	join strings
$substr / $substrCP	substring
$toUpper	uppercase
$toLower	lowercase
$strLenCP	string length
$add, $subtract, $multiply, $divide, $mod	math
    
{
  $project: {
    fullName: { $concat: ["$firstName", " ", "$lastName"] },
    nameLength: { $strLenCP: "$firstName" },
    yearOfBirth: { $subtract: [2025, "$age"] }
  }
}

    
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