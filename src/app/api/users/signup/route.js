import { connect } from "@/dbconfig/dbconfig";
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";




export async function POST(NextRequest) {
    await  connect()
    try {
        const reqBody = await NextRequest.json();
        const {firstname, lastname, email, password} = reqBody;
        console.log(reqBody);
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error:"User already exists"},{status:400})
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password:hashedpassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        //send verification mail
        await sendEmail({email, emailType:"VERIFY", userId:savedUser._id})
        return NextResponse.json({
            message:"User registered successfully",
            success:true,
            savedUser
        })

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500});
    }
}