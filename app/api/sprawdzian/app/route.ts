


"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data =`
    import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';
interface state{
  zad1:{
    nazwaKlubu:string
  },
  zad2:{
    position:string
  },
  zad3:{
    goalCount:number
  },
  zad4:{
    playerCount:number
  },
  zad8:{
    age:number
  },
  zad9:{
    position:string
  },
    zad10:{
    nazwaKlubu:string
  },
}
var initialForm = {
zad1:{
          nazwaKlubu:""
        },
        zad2:{
          position:""
        },
        zad3:{
          goalCount:-1
        },
        zad4:{
          playerCount:-1
        },
        zad8:{
          age:-1
        },
        zad9:{
          position:""
        },
          zad10:{
            nazwaKlubu:""
          },
      }
function App() {
      const [data,setData]=useState<state>(initialForm)
      async function fetchData(zadanieNr:number,params:string|number){
        if(params.toString().trim()==""||params==-1){
          console.log("Wypełnij dane")
          return;
        }
        try {
          const request = await axios.post("http://localhost:5000/api/zad{zadanieNr}",{params:params})
          const response = await request.data
          console.log(response)
        } catch (error) {
            console.error(error)
        }
      }
      async function getData(zadanieNr:number){
        try {
          const request = await axios.get("http://localhost:5000/api/zad{zadanieNr}")
          const response = await request.data
          console.log(response)
        } catch (error) {
            console.error(error)
        }
      }
     return <div className='box'>
        <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 1</Card.Header>
        <Card.Body>
          <Card.Title>Podaj nazwe klubu</Card.Title>
          <Card.Text>
            <input type='text' value={data.zad1.nazwaKlubu} onChange={(e)=>setData({...data,zad1:{nazwaKlubu:e.target.value.trim()}})} />
            <Button onClick={()=>fetchData(1,data.zad1.nazwaKlubu)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 2</Card.Header>
        <Card.Body>
          <Card.Title>Podaj nazwe pozycji</Card.Title>
          <Card.Text>
            <input type='text'  value={data.zad2.position} onChange={(e)=>setData({...data,zad2:{position:e.target.value.trim()}})} />
            <Button onClick={()=>fetchData(2,data.zad2.position)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 3</Card.Header>
        <Card.Body>
          <Card.Title>Podaj minimalna liczbe goli</Card.Title>
          <Card.Text>
            <input type='number' min={0} value={data.zad3.goalCount} onChange={(e)=>setData({...data,zad3:{goalCount:parseInt(e.target.value.trim())}})} />
            <Button onClick={()=>fetchData(3,data.zad3.goalCount)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 4</Card.Header>
        <Card.Body>
          <Card.Title>Podaj ilu zawodników zwrócic</Card.Title>
          <Card.Text>
            <input type='number' min={0} value={data.zad4.playerCount} onChange={(e)=>setData({...data,zad4:{playerCount:parseInt(e.target.value.trim())}})} />
            <Button onClick={()=>fetchData(4,data.zad4.playerCount)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 5</Card.Header>
        <Card.Body>
          <Card.Title>Pobierz dane</Card.Title>
          <Card.Text>
            <Button onClick={()=>getData(5)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 6</Card.Header>
        <Card.Body>
          <Card.Title>Pobierz dane</Card.Title>
          <Card.Text>
            <Button onClick={()=>getData(6)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 7</Card.Header>
        <Card.Body>
          <Card.Title>Pobierz dane</Card.Title>
          <Card.Text>
            <Button onClick={()=>getData(7)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 8</Card.Header>
        <Card.Body>
          <Card.Title>Podaj minimalny wiek</Card.Title>
          <Card.Text>
              <input type='number' min={0} value={data.zad8.age} onChange={(e)=>setData({...data,zad8:{age:parseInt(e.target.value.trim())}})} />            
              <Button onClick={()=>fetchData(8,data.zad8.age)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 9</Card.Header>
        <Card.Body>
          <Card.Title>Podaj pozycje</Card.Title>
          <Card.Text>
            <input type='text'  value={data.zad9.position} onChange={(e)=>setData({...data,zad9:{position:e.target.value.trim()}})} />
            <Button onClick={()=>fetchData(9,data.zad9.position)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Zadanie 10</Card.Header>
        <Card.Body>
          <Card.Title>Podaj nazwe klubu</Card.Title>
          <Card.Text>
            <input type='text'  value={data.zad10.nazwaKlubu} onChange={(e)=>setData({...data,zad10:{nazwaKlubu:e.target.value.trim()}})} />
            <Button onClick={()=>fetchData(10,data.zad10.nazwaKlubu)} variant="success">Success</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
     </div>
}

export default App;
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