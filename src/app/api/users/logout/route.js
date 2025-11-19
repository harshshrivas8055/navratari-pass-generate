import { connect } from "@/dbconfig/dbconfig";
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'
import bcryptjs from 'bcryptjs'
//import { sendEmail } from "@/helpers/mailer";
import jwt from 'jsonwebtoken';

export async function POST(NextRequest) {
    await  connect()
    try {
        const response = NextResponse.json({
            message:"Logout Successfully",
            success:true
        })

        response.cookies.set("token","",{
            httpOnly:true,
            expires:new Date(0)
        })

        return response

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500});
    }
}