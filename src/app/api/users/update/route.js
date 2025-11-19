import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connect();

  try {
    const body = await req.json();
    const { location, paymentStatus } = body;

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((x) => x.startsWith("token="))
      ?.split("=")[1];

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    user.location = location;
    user.paymentStatus = paymentStatus;

    await user.save();

    return NextResponse.json({ message: "Updated successfully!" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error updating" }, { status: 500 });
  }
}
