"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ZgloszeniaSerwisowe from './components/zgloszeniaSerwisowe';
import {useState, useEffect} from 'react';
import axios from 'axios';


function App() {
  const [zgloszenia,setZgloszenia] = useState([]);

      async function getData(){
        try{
            const request = await axios.get("http://localhost:2750/api/zgloszenia")
            const data = await request.data
            console.log(data)
            setZgloszenia(data)
        }catch(error){
            console.log(error)
        }
    }
    function addZgloszenia(val){
      setZgloszenia([...zgloszenia,val])
    }

    useEffect(()=>{
        getData()
    },[])

  return<>
    <ZgloszeniaSerwisowe fkc={setZgloszenia} data={zgloszenia}></ZgloszeniaSerwisowe>    
  </>
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