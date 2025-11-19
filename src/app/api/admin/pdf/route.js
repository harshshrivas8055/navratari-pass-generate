import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { cookies } from "next/headers";

pdfMake.vfs = pdfFonts.vfs;

export async function GET(req) {
  await connect();

  try {
    // 🔥 FIX: cookies() must be awaited
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const admin = await User.findById(decoded.id);
    if (!admin || !admin.isAdmin)
      return NextResponse.json({ error: "Not Admin" }, { status: 403 });

    const userId = new URL(req.url).searchParams.get("userId");

    const user = await User.findById(userId).lean();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Load image safely
    let imageBase64 = null;

    if (user.image) {
      const filePath = path.join(process.cwd(), "public", user.image);

      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        imageBase64 = `data:image/png;base64,${buffer.toString("base64")}`;
      }
    }

   const docDefinition = {
  content: [
    {
      text: "User Profile Summary",
      style: "header",
      alignment: "center",
      margin: [0, 0, 0, 20],
    },

    imageBase64 && {
      image: imageBase64,
      width: 120,
      alignment: "center",
      margin: [0, 0, 0, 20],
    },

    {
      style: "tableExample",
      table: {
        widths: ["30%", "70%"],
        body: [
          [{ text: "Full Name", style: "tableHeader" }, `${user.firstname} ${user.lastname}`],
          [{ text: "Email", style: "tableHeader" }, user.email],
          [{ text: "Location", style: "tableHeader" }, user.location || "Not provided"],
          [{ text: "Payment Status", style: "tableHeader" }, user.paymentStatus ? "✅ Paid" : "❌ Unpaid"],
        ],
      },
      layout: {
        fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f5f5f5" : null),
      },
    },

    {
      text: "\nGenerated on: " + new Date().toLocaleDateString(),
      style: "footer",
      alignment: "right",
    },
  ].filter(Boolean),

  styles: {
    header: {
      fontSize: 20,
      bold: true,
      color: "#2c3e50",
    },
    tableHeader: {
      bold: true,
      fillColor: "#e0e0e0",
      color: "#333",
    },
    footer: {
      fontSize: 9,
      italics: true,
      color: "#888",
    },
  },
};

    const pdfDoc = pdfMake.createPdf(docDefinition);

    return new Promise((resolve) => {
      pdfDoc.getBase64((data) => {
        resolve(
          new NextResponse(Buffer.from(data, "base64"), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": "inline; filename=user.pdf",
            },
          })
        );
      });
    });
  } catch (err) {
    console.error("PDF ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
