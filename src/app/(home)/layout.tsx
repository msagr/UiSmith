/* eslint-disable */

import { Navbar } from "@/modules/projects/ui/components/navbar";

interface Props { 
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <main className="relative flex flex-col min-h-screen max-h-screen">
            <Navbar />
            <div className="fixed inset-0 -z-10 h-full w-full 
                bg-[radial-gradient(#dadde2_1px,transparent_1px)] 
                dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] 
                [background-size:16px_16px]" 
            />
            <div className="flex-1 flex flex-col px-4 pb-4">
                {children}
            </div>
        </main>
    );
};

export default Layout;
