"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import useOrigin from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

const InviteModel = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, type, onClose, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "invite";

  const origin = useOrigin();

  const inviteUrl = `${origin}/invite/${data.server?.inviteCode}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${data.server?.id}/invite-code`
      );

      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Invite friends to {data.server?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 ">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              readOnly
              value={inviteUrl}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
            />

            <Button disabled={isLoading} onClick={() => onCopy()} size="icon">
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={() => onNew()}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs mt-4 text-zinc-500"
          >
            Generate a new link
            <RefreshCw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModel;
