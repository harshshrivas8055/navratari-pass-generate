import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

connect();

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const admin = await User.findById(decoded.id);
    if (!admin || !admin.isAdmin)
      return NextResponse.json({ error: "Not Admin" }, { status: 403 });

    // Fetch all users except password
    const users = await User.find({}, "-password");

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const admin = await User.findById(decoded.id);
    if (!admin || !admin.isAdmin)
      return NextResponse.json({ error: "Not Admin" }, { status: 403 });

    const body = await req.json();
    const UserId = body.id;

    if (!UserId || !mongoose.Types.ObjectId.isValid(UserId)) {
      return NextResponse.json({ error: "invalid user ID" }, { status: 400 });
    }

    const deleteUser = await User.findByIdAndDelete(UserId);
    if (!deleteUser) {
      return NextResponse.json({ error: "user not found " }, { status: 404 });
    }

    return NextResponse.json({ message: "user deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
