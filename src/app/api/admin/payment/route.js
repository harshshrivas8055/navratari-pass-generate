import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const admin = await User.findById(decoded.id);
    if (!admin || !admin.isAdmin)
      return NextResponse.json({ error: "Not Admin" }, { status: 403 });

    const { userId, paymentStatus } = await req.json();

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.paymentStatus = paymentStatus;
    await user.save();

    return NextResponse.json({
      message: "Payment status updated",
      paymentStatus: user.paymentStatus,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
