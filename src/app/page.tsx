'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [value, setValue] = useState('');

  const trpc = useTRPC();
  // const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
    })
  );

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-4">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({ value: value })}
        >
          Submit
        </Button>
        {/* {JSON.stringify(messages, null, 2)} */}
      </div>
    </div>
  );
}
