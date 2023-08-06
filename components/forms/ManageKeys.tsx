"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { z } from "zod";
import { Button } from "../ui/Button";
import { useEffect } from "react";
import { toast } from "../ui/UseToast";
import { useUpsertKey } from "@/hooks/useKey";
import { Input } from "../ui/Input";
import { type MemberUserKeys } from "../members/MembersColmns";

const FormSchema = z.object({
  rfid: z.string(),
  id: z.string().optional(),
  discordUserID: z.string(),
});

interface UserKeysFormProps {
  member: MemberUserKeys;
  setOpen: (open: boolean) => void;
}

const UserKeyForm = ({ member, setOpen }: UserKeysFormProps) => {
  const upsertKey = useUpsertKey();
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      rfid: member.key?.rfid,
      discordUserID: member.user?.id,
    },
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (upsertKey.isSuccess) {
      toast({
        title: "Key successfully updated!",
      });
      form.reset();
      setOpen(false);
    }
    if (upsertKey.isError) {
      toast({
        title: "Error updating key!",
        description: upsertKey.error.message,
      });
      console.error(upsertKey.error);
    }
  }, [form, upsertKey.error, upsertKey.isSuccess, upsertKey.isError, setOpen]);

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    if (member.user?.id)
      upsertKey.mutate({ discordUserId: member.user?.id, rfid: values.rfid });
  };

  const onReset = () => form.reset();

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        onReset={onReset}
      >
        <div className="flex flex-wrap gap-8">
          <FormField
            control={form.control}
            name="rfid"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>RFID Key</FormLabel>
                <FormControl>
                  <Input placeholder="rfid key" {...field} />
                </FormControl>
                <FormDescription>
                  This is the unique ID of the RFID key fob.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-row justify-end space-x-4">
          <Button
            disabled={!form.formState.isDirty}
            type="reset"
            variant={"destructive"}
          >
            Reset
          </Button>
          <Button disabled={!form.formState.isDirty} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserKeyForm;
