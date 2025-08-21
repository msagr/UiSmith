import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";

export default async function Page() {
  const data  = await caller.hello({ text: "SERVER CALL"});

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
