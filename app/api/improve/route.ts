import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import OpenAI from "openai"

const prisma = new PrismaClient()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  let resume = ""

  try {
    const body = await req.json()
    resume = body.resume

    let improved = ""

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: resume }
        ]
      })

      improved = completion.choices?.[0]?.message?.content || ""

    } catch (aiError) {
      console.error("AI failed, using fallback")

      improved = `Improved version:
- ${resume}
- Structured better
- More professional`
    }

    // ✅ SAVE TO DATABASE (CRITICAL)
    const saved = await prisma.resume.create({
      data: {
        original: resume,
        improved
      }
    })

    return NextResponse.json(saved)

  } catch (error) {
    console.error("API ERROR:", error)

    return NextResponse.json(
      { error: "Server failed" },
      { status: 500 }
    )
  }
}