"use client"
import axios from "axios"
import { useEffect } from "react"

export default function Home(){

    async function test(){
        try {
            
            const res = await axios.post("/api/send_notification",{
                userID:"+48123456789",
                title:"test",
            body:"test",
            priority:"high",
            notificationType:"push"
        })
        const resp = await res.data
        console.log(resp)
    } catch (error) {
        console.log(error)
    }
    
    }
    useEffect(()=>{
test()
    },[])
    return<html>
        <body>

        </body>
    </html>
}