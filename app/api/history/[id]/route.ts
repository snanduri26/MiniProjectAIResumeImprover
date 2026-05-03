import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.resume.delete({
      where: { id: Number(id) }
    }) // ✅ properly closed

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("DELETE ERROR:", error)

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    )
  }
}