import Ping from "@/components/ui/Ping";
import { incrementViews } from "@/lib/action";
import { unstable_after as after } from "next/server";

const View = async ({ id}: { id: string }) => {
    after(
        async () =>
            await incrementViews(id)
    );

    return (
        <div className = "view-container">
            <div className={"absolute -top-2-right-2"}>
                <Ping />
            </div>
        </div>
    );
};
export default View;