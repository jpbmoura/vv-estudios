import { NextResponse, type NextRequest } from "next/server";

// Checagem otimista: sem cookie, nem renderiza o painel. A assinatura é validada em requireAdmin().
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/adm/login") return NextResponse.next();
  if (!request.cookies.has("vv_adm")) return NextResponse.redirect(new URL("/adm/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/adm", "/adm/:path*"],
};
