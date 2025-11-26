import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Event from "@/models/eventsModel";

export async function POST(req) {
  try {
    await connect();
    const body = await req.json();

    const { title, description, date, location, capacity } = body;

    // Read token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ROLE CHECK
    if (!user.isAdmin) {
      return NextResponse.json(
        { message: "Only admin can create events" },
        { status: 403 }
      );
    }

    // Create Event
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      createdBy: user._id,
    });

    console.log(newEvent);

    return NextResponse.json(
      { message: "Event created successfully", event: newEvent },
      { status: 200 }
    );

  } catch (error) {
    console.log("EVENT_CREATE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
