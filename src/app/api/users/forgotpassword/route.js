// import { connect } from "@/dbconfig/dbconfig";
// import User from "@/models/userModel";
// import { NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";

// export async function POST(req) {
//   await connect();
//   try {
//     const { email, newPassword } = await req.json();

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const salt = await bcryptjs.genSalt(10);
//     const hashedPassword = await bcryptjs.hash(newPassword, salt);

//     user.password = hashedPassword;
//     await user.save();

//     return NextResponse.json({
//       message: "Password reset successful",
//       success: true,
//     });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
