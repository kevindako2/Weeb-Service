import { incrementViews } from "@/lib/action";
import { unstable_after as after } from "next/server";
import { client } from "@/sanity/lib/client";
import { EyeIcon } from "lucide-react";

const View = async ({ id}: { id: string }) => {
    after(
        async () =>
            await incrementViews(id)
    );

    const startup = await client.fetch(
        `*[_type == "startup" && _id == $id][0]{ views }`,
        { id }
    );

    return (
        <div className="view-container">
            <div className="absolute -top-2 -right-2">
                <div className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-lg shadow-lg animate-pulse">
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{startup?.views || 0}</span>
                </div>
            </div>
        </div>
    );
};
export default View;