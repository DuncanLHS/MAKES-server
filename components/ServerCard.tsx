"use client";
import Image from "next/image";
import React from "react";
import placeholder from "@/components/images/placeholder-300x300.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type APIGuild } from "discord-api-types/v10";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServerSettingsNew from "./forms/ServerSettings";

interface ServerCardProps {
  guild: APIGuild;
}
const queryClient = new QueryClient();

const ServerCard = ({ guild }: ServerCardProps) => {
  const { id, icon, name } = guild;
  const imgSrc = icon
    ? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
    : placeholder;
  return (
    <QueryClientProvider client={queryClient}>
      <Card key={id} className="w-96">
        <CardHeader className="flex-row gap-4">
          <Image src={imgSrc} alt={`${name} icon`} height={48} width={48} />
          <CardTitle className="text-2xl">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <ServerSettingsNew />
        </CardContent>
      </Card>
    </QueryClientProvider>
  );
};

export default ServerCard;
