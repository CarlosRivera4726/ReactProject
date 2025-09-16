import type { ReactNode } from "react";


const SpanLink = ({ children }: { children: ReactNode }) => {
    return (
        <span className="flex items-center gap-1 text-sm w-full text-gray-900 transition duration-75 rounded-lg pl-5 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            {children}
        </span>
    );
};

export default SpanLink;