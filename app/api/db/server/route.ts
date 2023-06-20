import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";

const guildId = "1071217231515615282";

export async function GET() {
  try {
    const res = await prisma.server.findUnique({
      where: {
        guildId: guildId,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.error();
  }
}
