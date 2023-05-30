import Image from "next/image";
import React from "react";
import placeholder from "@/components/images/placeholder-300x300.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type APIGuild } from "discord-api-types/v10";

interface ServerCardProps {
  guild: APIGuild;
}

const ServerCard = ({ guild }: ServerCardProps) => {
  const imgSrc = guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    : placeholder;
  return (
    <Card key={guild.id} className="w-96">
      <CardHeader className="flex-row gap-4">
        <Image src={imgSrc} alt={`${guild.name} icon`} height={48} width={48} />
        <CardTitle className="text-2xl">{guild.name}</CardTitle>
      </CardHeader>
      <CardContent>{/* Form */}</CardContent>
    </Card>
  );
};

export default ServerCard;
