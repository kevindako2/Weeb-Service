import { Skeleton } from "@/components/ui/skeleton";

const UserProfileSkeleton = () => {
    return (
        <>
            <section className="pink_container !min-h-[230px]">
                <div className="flex flex-col items-center justify-center gap-5">
                    <Skeleton className="w-[120px] h-[120px] rounded-full" />
                    <div className="text-center space-y-2">
                        <Skeleton className="h-10 w-64 mx-auto" />
                        <Skeleton className="h-6 w-32 mx-auto" />
                    </div>
                </div>
            </section>

            <section className="section_container">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10">
                        <Skeleton className="h-8 w-24 mb-4" />
                        <Skeleton className="h-20 w-full" />
                    </div>

                    <hr className="divider" />

                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-7">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-6 w-8" />
                        </div>

                        <div className="card_grid">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-64 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserProfileSkeleton;
