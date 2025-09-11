"use client";

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MessagesContainer } from '../components/message-container';
import { Suspense } from 'react';

interface Props {
    projectId: string;
};

export const ProjectView = ({ projectId }: Props) => {
    const trpc = useTRPC();
    const { data: project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }));

    return (
        <div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize = {35}
                    minSize = {20}
                    className = "flex flex-col min-h-0"
                >
                    <Suspense fallback={<p>Loading messages .... </p>}>
                        <MessagesContainer projectId = {projectId} />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize = {65}
                    minSize = {50}
                >
                    TODO: Preview
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
};