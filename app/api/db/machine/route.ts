import { prisma } from "@/prisma/db";
import { type Machine } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

// see issue https://github.com/vercel/next.js/discussions/50497
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as Partial<Machine>;
  console.log("DATA: ", data);
  try {
    if (!data.id) {
      return NextResponse.json(
        { error: "Error. ID required" },
        { status: 500, statusText: "Error. ID required" }
      );
    }
    if (data.accessRoles && data.accessRoles.length < 1) {
      return NextResponse.json(
        { error: "Error. One access role required" },
        { status: 500, statusText: "Error. One access role required" }
      );
    }
    if (data.inductorRoles && data.inductorRoles.length < 1) {
      return NextResponse.json(
        { error: "Error. One inductor role required" },
        { status: 500, statusText: "Error. One inductor role required" }
      );
    }
    if (!data.name) {
      return NextResponse.json(
        { error: "Error. Name required" },
        { status: 500, statusText: "Error. Name required" }
      );
    }

    revalidateTag("machine");

    const res = await prisma.machine.upsert({
      where: {
        id: data.id,
      },
      update: {
        name: data.name,
        accessRoles: data.accessRoles,
        inductorRoles: data.inductorRoles,
      },
      create: {
        id: data.id,
        name: data.name,
        accessRoles: data.accessRoles,
        inductorRoles: data.inductorRoles,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function DELETE(req: NextRequest) {
  const data = (await req.json()) as Partial<Machine>;
  try {
    if (!data.id) {
      return NextResponse.json(
        { error: "Error. ID required" },
        { status: 500 }
      );
    }

    const res = await prisma.machine.delete({
      where: {
        id: data.id,
      },
    });

    revalidateTag("machine");

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.error();
  }
}
