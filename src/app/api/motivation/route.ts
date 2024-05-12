import { NextRequest, NextResponse } from "next/server";

export function GET(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  // GET /api/users リクエストの処理
  return new NextResponse("GET request processed");
}

export function POST(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  // POST /api/users リクエストの処理
  return new NextResponse("POST request processed");
}
