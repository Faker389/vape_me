
"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `// controllers/productController.js
const Product = require("../Model/ProduktModel.js");

exports.filterProducts = async (req, res) => {
  try {
    const { type } = req.query;

    // Zadanie 1 – produkty tańsze niż maxCena
    if (type === "tansze") {
      const maxCena = Number(req.query.maxCena);
      const result = await Product.find({ cena: { $lt: maxCena } })
        .sort({ cena: 1 }); // rosnąco
      return res.json(result);
    }

    // Zadanie 2 – produkty z rabatem większym niż minRabat
    if (type === "rabat") {
      const minRabat = Number(req.query.minRabat);
      const result = await Product.find({ rabat: { $gt: minRabat } })
        .select("nazwa cena rabat")
        .sort({ rabat: -1 }); // malejąco
      return res.json(result);
    }

    // Zadanie 3 – produkty z wybranej kategorii
    if (type === "kategoria") {
      const kat = req.query.kategoria;
      const result = await Product.find({ kategoria: kat })
        .sort({ cena: 1 });
      return res.json(result);
    }

    res.status(400).json({ error: "Nieznany typ zapytania" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};`

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