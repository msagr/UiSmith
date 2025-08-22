"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default function Page() {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => toast.success("Background job started")
  })); 

  return (
    <div>
      <Button disabled={invoke.isPending} onClick={() => invoke.mutate({ text: "John" })}>
        Invoke Background Job
      </Button>
    </div>
  );
}
