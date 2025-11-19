import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/forgotpassword";

  const isAdminPath = path.startsWith("/admin");
  const token = request.cookies.get("token")?.value || "";

  // No token + public route → allow
  if (!token && isPublicPath) {
    return NextResponse.next();
  }

  // No token + trying to access protected route → redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const isAdmin = payload.isAdmin === true;
    const isVerified = payload.isVerified === true;

    // ==========================
    // 🔐 ADMIN ROUTE PROTECTION
    // ==========================
    if (isAdminPath) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/profile", request.url)); 
      }
      return NextResponse.next();
    }

    // ==========================
    // 🔐 PUBLIC ROUTES WHILE LOGGED IN
    // ==========================
    if (isPublicPath) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    // ==========================
    // 🔐 EMAIL VERIFICATION CHECK
    // ==========================
    if (!isVerified && path !== "/verifyemail") {
      return NextResponse.redirect(new URL("/verifyemail", request.url));
    }

    // Normal user allowed
    return NextResponse.next();

  } catch (err) {
    console.error("Invalid token:", err);

    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/profile/:path*",
    "/verifyemail",
    "/forgotpassword",
    "/admin/:path*", // protect all admin pages
  ],
};
