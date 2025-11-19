import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

pdfMake.vfs = pdfFonts.vfs;

export async function GET(req) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response("Invalid User ID format", { status: 400 });
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Load uploaded image safely
    let base64Image = "";
    if (user.image) {
      try {
        const imgPath = path.join(process.cwd(), "public", user.image);
        const imgBuffer = fs.readFileSync(imgPath);
        base64Image = imgBuffer.toString("base64");
      } catch (err) {
        console.warn("Image file not found or unreadable:", err);
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

    ...(base64Image
      ? [
          {
            image: `data:image/png;base64,${base64Image}`,
            width: 120,
            alignment: "center",
            margin: [0, 0, 0, 20],
          },
        ]
      : []),

    {
      style: "tableExample",
      table: {
        widths: ["30%", "70%"],
        body: [
          [{ text: "Full Name", style: "tableHeader" }, `${user.firstname} ${user.lastname}`],
          [{ text: "Email", style: "tableHeader" }, user.email],
          [{ text: "Location", style: "tableHeader" }, user.location || "Not provided"],
          [
            { text: "Payment Status", style: "tableHeader" },
            user.paymentStatus ? "✅ Paid" : "❌ Unpaid",
          ],
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
  ],

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
          new Response(Buffer.from(data, "base64"), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": "inline; filename=user.pdf",
              "Access-Control-Allow-Origin": "*",
            },
          })
        );
      });
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response("Server Error", { status: 500 });
  }
}
