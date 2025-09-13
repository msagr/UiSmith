/* eslint-disable */

"use client";

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MessagesContainer } from '../components/message-container';
import { Suspense } from 'react';
import { useState } from 'react';
import { Fragment } from '@/generated/prisma';
import { ProjectHeader } from '../components/project-header';
import { FragmentWeb } from '../components/fragment-web';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeIcon, EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CrownIcon } from 'lucide-react';

interface Props {
    projectId: string;
};

export const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    const [tabState, setTabState] = useState<"preview" | "code">("preview");

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
                    <Suspense fallback={<p>Loading project...</p>}>
                        <ProjectHeader projectId={projectId} />
                    </Suspense>
                    <Suspense fallback={<p>Loading messages .... </p>}>
                        <MessagesContainer projectId = {projectId} activeFragment={activeFragment} setActiveFragment={setActiveFragment}/>
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize = {65}
                    minSize = {50}
                >
                    <Tabs
                        className = "h-full gap-y-0"
                        defaultValue = "preview"
                        value = {tabState}
                        onValueChange = {(value) => setTabState(value as "preview" | "code")}
                    >
                        <div className="w-full flex items-center p-2 border-b gap-x-2">
                            <TabsList className="h-8 p-0 border rounded-md">
                                <TabsTrigger value="preview" className="rounded-md">
                                    <EyeIcon /> <span>Demo</span>
                                </TabsTrigger>
                                <TabsTrigger value="code" className="rounded-md">
                                    <CodeIcon /> <span>Code</span>
                                </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-x-2">
                                <Button asChild size="sm" variant="default">
                                    <Link href="/pricing">
                                        <CrownIcon /> Upgrade
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="preview">
                            {!!activeFragment && <FragmentWeb data={activeFragment}/>}
                        </TabsContent>
                        <TabsContent value="code">
                            <p>TODO: Code</p>
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
};