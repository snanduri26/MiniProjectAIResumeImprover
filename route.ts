import { NextResponse } from "next/server"

export async function POST() {
  console.log("🔥 API IS RUNNING")

  return NextResponse.json({
    improved: "API is working now"
  })
}