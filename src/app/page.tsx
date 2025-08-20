import { Button } from "@/components/ui/button";
import  prisma  from "@/lib/db";

export default async function Page() {
  const users = await prisma.post.findMany();
  return (
    <div className="">
      {JSON.stringify(users, null, 2)}
    </div>
  );
}
