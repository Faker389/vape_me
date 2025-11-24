"use server";

import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const data = `import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {useState} from 'react';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Button, ButtonGroup, Card, ProgressBar, ToggleButton } from "react-bootstrap"

var initialForm = {
    title:"jakis",
    stat:"nowy",
    prio:"niski",
    deadline:"12-12-2021",
    progress:0,
    person:"jan"
}

export default function ZgloszeniaSerwisowe({fkc,data})
{
    const [formData, setFormData] = useState(initialForm);
    const [statusRadioVal, setStatusRadioVal] = useState("")
    async function handleSub(e){
        e.preventDefault()
        console.log(formData)
        try{
            const request = await axios.post("http://localhost:2750/api/zgloszenia",formData)
            const cos = await request.data
            fkc([...data,formData])
            console.log(data)
        }catch(error){
            console.log(error);
        }
    }

    async function filterProducts(params) {
        console.log(params)
        setStatusRadioVal(params)
        try{
            const request = await axios.get("http://localhost:2750/api/zgloszenia/$params}")
            const data = await request.data
            fkc(data)
            console.log(data)
        }catch(error){
            console.log(error);
        }
    }


    return<>
    <Form onSubmit={handleSub} style={{width: "50%"}}>
            <h1>Zgłoszenia serwisowe panel</h1>
            <Row>
                <Form.Group className="mb-3" controlId="formGridPassword">
                    <Form.Label>Tytuł zgłoszenia</Form.Label>
                    <Form.Control onChange={(e)=>setFormData({...formData,title:e.target.value})} type="text" placeholder="np. Zerwanie magistrali sieciowej" value={formData.title}/>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Status</Form.Label>
                    <Form.Select  onChange={(e)=>setFormData({...formData,stat:e.target.value})} value={formData.stat}>
                        <option value="nowe">Nowe</option>
                        <option value="w realizacji">W realizacji</option>
                        <option value="zakończone">Zakończone</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Priorytet</Form.Label>
                    <Form.Select  onChange={(e)=>setFormData({...formData,prio:e.target.value})} value={formData.prio}>
                        <option value="wysoki">Wysoki</option>
                        <option value="średni">Średni</option>
                        <option value="niski">Niski</option>
                    </Form.Select>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} controlId="formGridPassword" >
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control onChange={(e)=>setFormData({...formData,deadline:e.target.value})} type="date" value={formData.deadline}/>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Postęp (wprowadź w liczbie procentowej)</Form.Label>
                    <Form.Control onChange={(e)=>setFormData({...formData,progress:parseInt(e.target.value)})} type="number" value={formData.progress}/>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group className="mb-3" controlId="formGridPassword">
                    <Form.Label>Osoba odpowiedzialna</Form.Label>
                    <Form.Control onChange={(e)=>setFormData({...formData,person:e.target.value})} type="text" placeholder="Maria Magdalena" value={formData.person}/>
                </Form.Group>
            </Row>
                <Button variant="primary" type="submit">
                    Submit
                </Button>

        </Form> 

        <p>Filtry Statusu</p>
            <ButtonGroup>
            {[
                { name: 'Wszystkie', value: 'wszystkie',variatnt:"outline-primary",variant2:"primary" },
                { name: 'Wysoki', value: 'wysoki',variatnt:"outline-dark",variant2:"dark" },
                { name: 'Średni', value: 'średni',variatnt:"outline-info",variant2:"info" },
                { name: 'Niski', value: 'niski',variatnt:"outline-secondary",variant2:"secondary" },
            ].map((radio, idx) => (
            <ToggleButton
                key={idx}
                type="radio"
                variant={statusRadioVal === radio.value?radio.variant2:radio.variatnt}
                name="radio"
                value={radio.value}
                checked={statusRadioVal === radio.value}
                onClick={(e) => filterProducts(radio.value)}
            >
                {radio.name}
            </ToggleButton>
            ))}
        </ButtonGroup>
        <div>
                    {data.map((ev,index)=>(
                    <Card style={{ width: '20rem' }} key={index}>
                    <Card.Body>
                    <Card.Title>{ev.title}</Card.Title>
                        <Card.Text>{ev.stat}</Card.Text>
                        <Card.Text>{ev.prio}</Card.Text>
                        <Card.Text>{ev.deadline}</Card.Text>
                        <Card.Text>Odpowiedzialny: {ev.person}</Card.Text>
                        {ev.progress}%<ProgressBar now={ev.progress}></ProgressBar>
                    </Card.Body>
                </Card>
                ))}
            </div>
        
        </>


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