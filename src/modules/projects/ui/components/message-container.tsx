/* eslint-disable */

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";

interface Props {
    projectId: string;
};

export const MessagesContainer = ({ projectId }: Props) => {
    const trpc = useTRPC();
    const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
        projectId: projectId,
    }));

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="pt-2 pr-1">
                    {messages.map((message) => (
                        <MessageCard 
                            key = {message.id}
                            content = {message.content}
                            role = {message.role}
                            fragment = {message.fragment}
                            createdAt = {message.createdAt}
                            isActiveFragment = {false}
                            onFragmentClick = {() => {}}
                            type = {message.type}
                        />
                    ))}
                </div>
            </div>
            {/* {JSON.stringify(messages)} */}
            <div className="relative p-3 pt-1 mt-auto">
                <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
                <MessageForm projectId = {projectId} />
            </div>
        </div>
    )
};