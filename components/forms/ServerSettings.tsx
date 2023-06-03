"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@ui/Button";
import { toast } from "@/components/ui/UseToast";
import { Form } from "@/components/forms/Form";
import { RolePicker } from "./fields/RolePicker";

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
});

export type FormData = z.infer<typeof FormSchema>;

export function ServerSettings() {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: FormData) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RolePicker form={form} name="language" />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
