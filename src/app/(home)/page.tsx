/* eslint-disable */

"use client";

import Image from "next/image";
import { ProjectForm } from "@/modules/home/ui/components/project-form";

const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image 
            src="/logo.svg"
            alt="Vibe"
            width={50}
            height={50}
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Lets craft award-winning websites
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Bring your ideas to life, just by chatting with UiSmith. 
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>
    </div>
  );
};

export default Page;