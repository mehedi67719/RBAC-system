import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const routePermissions = {
  "/dashboard": "dashboard.view",
  "/dashboard/users": "users.view",
  "/dashboard/users/create": "users.create",
  "/dashboard/leads": "leads.view",
  "/dashboard/leads/create": "leads.create",
  "/dashboard/tasks": "tasks.view",
  "/dashboard/tasks/create": "tasks.create",
  "/dashboard/reports": "reports.view",
  "/dashboard/audit-log": "audit.view",
  "/dashboard/permissions": "permissions.manage",
  "/dashboard/customer": "customer.view",
  "/dashboard/settings": "settings.manage",
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  const matched = Object.entries(routePermissions).find(([path]) => {
    return pathname === path || pathname.startsWith(path + "/");
  });

  if (!matched) {
    return NextResponse.next();
  }

  const requiredPermission = matched[1];

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userPermissions = token.permissions || [];

  if (!userPermissions.includes(requiredPermission)) {
    return NextResponse.rewrite(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

