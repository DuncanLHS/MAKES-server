// api route for requesting machine access

import { getMember } from "@/lib/discord";
import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";

interface MachineAccess {
  machineId: string;
  rfid?: string;
  sessionId?: string;
  startTime?: Date;
}

export async function POST(req: Request) {
  //assert that the request is a json object
  try {
    if (!req.headers.get("content-type")?.includes("application/json")) {
      console.error("no json");
      return NextResponse.json({}, { status: 400, statusText: "No JSON" });
    }

    const data = (await req.json()) as MachineAccess;
    //assert that the request has the correct fields

    if (data.sessionId) {
      //end the session
      const activeSession = await prisma.machineSession.findUnique({
        where: {
          id: data.sessionId,
        },
      });

      if (!activeSession) {
        console.error("session not found");
        return NextResponse.json(
          {},
          { status: 404, statusText: "Session not found" }
        );
      }

      if (activeSession.endTime) {
        console.error("session already ended");
        return NextResponse.json(
          {},
          { status: 400, statusText: "Session already ended" }
        );
      }

      const updatedSession = await prisma.machineSession.update({
        where: {
          id: data.sessionId,
        },
        data: {
          endTime: new Date(),
        },
      });

      const reponseBody = {
        machineId: updatedSession.machineId,
        sessionId: updatedSession.id,
        startTime: updatedSession.startTime,
        endTime: updatedSession.endTime,
      };

      return NextResponse.json(reponseBody, {
        status: 200,
        statusText: "Session Ended",
      });
    }

    if (!data.machineId) {
      console.error("no machineId");
      return NextResponse.json(
        {},
        { status: 400, statusText: "Missing machineId" }
      );
    }

    if (!data.rfid) {
      console.error("no rfid");
      return NextResponse.json({}, { status: 400, statusText: "Missing rfid" });
    }

    //check if the machine is in the database
    const machine = await prisma.machine.findUnique({
      where: {
        id: data.machineId,
      },
    });

    if (!machine) {
      console.error("machine not found");

      return NextResponse.json(
        {},
        { status: 404, statusText: "Machine not found" }
      );
    }

    //check if the rfid is in the database
    const rfid = await prisma.key.findUnique({
      where: {
        rfid: data.rfid,
      },
    });

    if (!rfid) {
      console.error("rfid not found");
      return NextResponse.json(
        {},
        { status: 404, statusText: "RFID not found" }
      );
    }

    //check if the rfid discorduserId has roles that match the machine access
    const discordUser = await getMember(rfid.discordUserId);

    if (!discordUser) {
      console.error("discord user not found");
      return NextResponse.json(
        {},
        { status: 404, statusText: "Discord user not found" }
      );
    }

    const memberRoles = discordUser.roles;
    const machineRoles = machine.accessRoles;

    const hasAccess = memberRoles.some((role) => machineRoles.includes(role));

    if (!hasAccess) {
      console.log("member does not have access");
      return NextResponse.json(
        {},
        { status: 403, statusText: "Forbidden - No access" }
      );
    }

    //check if the machine has an active session
    const session = await prisma.machineSession.findFirst({
      where: {
        machineId: data.machineId,
        endTime: null,
      },
    });

    if (session) {
      console.log("machine already in use");
      return NextResponse.json(
        {},
        { status: 403, statusText: "Forbidden - Machine in use" }
      );
    }

    //create a new session
    const newSession = await prisma.machineSession.create({
      data: {
        machineId: data.machineId,
        discordUserId: discordUser.user!.id,
        startTime: new Date(),
      },
    });

    const reponseBody = {
      machineId: newSession.machineId,
      sessionId: newSession.id,
      startTime: newSession.startTime,
    };

    return NextResponse.json(reponseBody, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {},
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
