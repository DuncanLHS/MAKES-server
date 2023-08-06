import { prisma } from "@/prisma/db";
import { type Key } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

// see issue https://github.com/vercel/next.js/discussions/50497
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { discordUserId } = (await req.json()) as Partial<Key>;

  try {
    const res = await prisma.key.findUnique({
      where: {
        discordUserId,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as Partial<Key>;
  if (!data.rfid || !data.discordUserId) return NextResponse.error();

  try {
    const { rfid, discordUserId } = data;

    const res = await prisma.key.upsert({
      where: {
        discordUserId,
      },
      update: {
        rfid,
      },
      create: {
        rfid,
        discordUserId,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.error();
  }
}
