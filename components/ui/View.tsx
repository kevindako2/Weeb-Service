import Ping from "@/components/ui/Ping";

const View = ({ id}: { id: string }) => {
    return (
        <div className = "view-container">
            <div className={"absolute -top-2-right-2"}>
                <Ping />
            </div>
        </div>
    );
};
export default View;