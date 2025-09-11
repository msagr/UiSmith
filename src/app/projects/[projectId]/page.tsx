/* eslint-disable */

import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
    params: Promise<{
        projectId: string;
    }>
};

const Page = async ({ params }: Props) => {
    const { projectId } = await params;
    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId
    }));
    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }));

    return (
        <div>
            Project Id: {projectId}
        </div>
    );
}

export default Page;