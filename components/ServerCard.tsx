"use client";
import Image from "next/image";
import React from "react";
import placeholder from "@/components/images/placeholder-300x300.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type APIGuild } from "discord-api-types/v10";
import { ServerSettings } from "./forms/ServerSettings";
import { FormProvider, useForm } from "react-hook-form";

interface ServerCardProps {
  guild: APIGuild;
}

const ServerCard = ({ guild }: ServerCardProps) => {
  const methods = useForm();
  const { id, icon, name } = guild;
  const imgSrc = icon
    ? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
    : placeholder;
  return (
    <Card key={id} className="w-96">
      <CardHeader className="flex-row gap-4">
        <Image src={imgSrc} alt={`${name} icon`} height={48} width={48} />
        <CardTitle className="text-2xl">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <ServerSettings />
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default ServerCard;
