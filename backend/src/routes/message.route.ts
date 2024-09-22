import express from "express";

const router = express.Router()

router.get('/conversation',(req,res)=>{
    res.send("Welcome to messages")
})

export default router