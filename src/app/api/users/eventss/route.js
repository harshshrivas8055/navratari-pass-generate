import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Event from "@/models/eventsModel";

export async function GET() {
  try {
    await connect();

    const events = await Event.find().select("-__v");

    return NextResponse.json(
      { events },
      { status: 200 }
    );
  } catch (error) {
    console.error("EVENT_FETCH_ERROR:", error);
    return NextResponse.json(
      { message: "Error fetching events" },
      { status: 500 }
    );
  }
}
