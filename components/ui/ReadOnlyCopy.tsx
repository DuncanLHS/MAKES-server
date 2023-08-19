import React from "react";
import { Label } from "./Label";
import { Button } from "./Button";
import { Copy } from "lucide-react";

interface ReadOnlyCopyProps {
  label: string;
  text: string;
}

const ReadOnlyCopy = ({ label, text }: ReadOnlyCopyProps) => {
  const copyToClipboard = async (
    text: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard: ", text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="w-full">
      <Label>{label}</Label>
      <div className="flex flex-row items-center justify-between rounded-md border-[1px]">
        <p className="p-2">{text}</p>
        <Button
          variant="outline"
          onClick={(e) => void copyToClipboard(text, e)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReadOnlyCopy;
