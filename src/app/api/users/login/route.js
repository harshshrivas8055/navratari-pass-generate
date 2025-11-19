import { connect } from "@/dbconfig/dbconfig";
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";
import jwt from 'jsonwebtoken';


export async function POST(NextRequest) {
    await  connect()
    try {
        const reqBody = await NextRequest.json();
        const {email, password} = reqBody;
        console.log(reqBody);
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error:"User not exists"},{status:400})
        }
        console.log("user exist");

        // ✅ check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Email not verified. Please verify your email first." },
        { status: 403 }
      );
    }
        
       const validpassword = await bcryptjs.compare(password, user.password)

       if(!validpassword){
        return NextResponse.json({error:"check credenticals"},{status:400})
       }

       const tokenData = {
        id:user._id,
        username:user.username,
        email:user.email,
        isVerified:user.isVerified,
        isAdmin:user.isAdmin,
       }

      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET,{expiresIn:'1d'})

        
        const response = NextResponse.json({
            message:"logged in success",
            success:true
        })

        response.cookies.set("token", token, {
            httpOnly:true
        })
        return response;

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500});
    }
}