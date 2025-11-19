import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
//import bcryptjs from 'bcryptjs'
//import { sendEmail } from "@/helpers/mailer";
//sendEmal can  be use to send here that user verified


export async function POST(NextRequest) {
  await  connect()
  try {
    const reqBody = await NextRequest.json()
    const {token} = reqBody
    console.log(token);

    const user = await User.findOne({verifyToken:token, verifyTokenExpiry:{$gt:Date.now()}})
    if(!user){
        return NextResponse.json({error:"Invalid token"},{status:400})
    }
    console.log(user);

    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined

    await user.save()

        return NextResponse.json({
        message:"Email verified successfully",
        success:true
    },{status:200})

    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
