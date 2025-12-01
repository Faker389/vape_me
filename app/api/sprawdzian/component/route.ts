"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data =  `
        import { useState } from "react";

function App() {
  const API = "http://localhost:3000/products/filter";

  const [wyniki, setWyniki] = useState([]);

  const [maxCena, setMaxCena] = useState("");
  const [minRabat, setMinRabat] = useState("");
  const [kategoria, setKategoria] = useState("Elektronika");

  function wyswietlTabele(data) {
    setWyniki(data);
  }

  function szukajTanszych() {
    fetch("API?type=tansze&maxCena=maxCena")
      .then(res => res.json())
      .then(wyswietlTabele);
  }

  function szukajRabatu() {
    fetch("API?type=rabat&minRabat=minRabat")
      .then(res => res.json())
      .then(wyswietlTabele);
  }

  function szukajKategorii() {
    fetch("API?type=kategoria&kategoria=kategoria")
      .then(res => res.json())
      .then(wyswietlTabele);
  }

  return (
    <div className="container py-4">

      <h2 className="mb-4 text-center">Filtr produktów</h2>

      <div className="row g-4">

        {/* Zadanie 1 */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Zadanie 1 — Tańsze niż:</h5>
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Maksymalna cena"
                value={maxCena}
                onChange={e => setMaxCena(e.target.value)}
              />
              <button className="btn btn-primary w-100" onClick={szukajTanszych}>
                Szukaj
              </button>
            </div>
          </div>
        </div>

        {/* Zadanie 2 */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Zadanie 2 — Rabat większy niż:</h5>
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Minimalny rabat (%)"
                value={minRabat}
                onChange={e => setMinRabat(e.target.value)}
              />
              <button className="btn btn-success w-100" onClick={szukajRabatu}>
                Szukaj
              </button>
            </div>
          </div>
        </div>

        {/* Zadanie 3 */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Zadanie 3 — Kategoria:</h5>

              <select
                className="form-select mb-3"
                value={kategoria}
                onChange={e => setKategoria(e.target.value)}
              >
                <option>Elektronika</option>
                <option>AGD</option>
                <option>RTV</option>
                <option>Akcesoria</option>
                <option>Inne</option>
              </select>

              <button className="btn btn-warning w-100" onClick={szukajKategorii}>
                Szukaj
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Wyniki */}
      <h3 className="mt-5">Wyniki:</h3>

      {wyniki.length === 0 ? (
        <p className="text-muted">Brak wyników</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3">
            <thead className="table-light">
              <tr>
                {Object.keys(wyniki[0]).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wyniki.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map(key => (
                    <td key={key}>{String(row[key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default App;`

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