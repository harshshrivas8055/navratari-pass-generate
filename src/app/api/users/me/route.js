import { connect } from "@/dbconfig/dbconfig";
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";
import jwt from 'jsonwebtoken';
import { getDataFromToken } from "@/helpers/getdatafromtoken";




export async function GET(NextRequest) {
    await  connect()
    //extract data from token
    const userId = await getDataFromToken(NextRequest);
    const user = await User.findOne({_id:userId}).select("-password")
    //check if there is no error
    return NextResponse.json({
        message:"user found",
        data:user
    })
}