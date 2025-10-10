import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY, STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import StartupCard, { StartupTypeCard } from "@/components/ui/StartupCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Author } from "@/sanity/types";

export const experimental_ppr = true;

const UserProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    const [user, userStartups] = await Promise.all([
        client.fetch(AUTHOR_BY_ID_QUERY, { id }),
        client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id }),
    ]);

    if (!user) return notFound();

    return (
        <>
            <section className="pink_container !min-h-[320px]">
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                        <Image
                            src={user.image || "https://cdn.pixabay.com/photo/2018/04/20/21/10/code-3337044_1280.jpg"}
                            alt={user.name || "User"}
                            width={200}
                            height={200}
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="heading !mb-2">{user.name || "Utilisateur"}</h1>
                        {user.username && (
                            <p className="sub-heading !max-w-5xl !mb-0">@{user.username}</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="section_container">
                <div className="max-w-5xl mx-auto">
                    {/* Bio Section */}
                    {user.bio ? (
                        <div className="mb-10">
                            <h2 className="text-30-bold mb-4">À propos</h2>
                            <p className="text-16-medium text-black-300 leading-relaxed bg-white p-6 rounded-lg shadow-100">
                                {user.bio}
                            </p>
                        </div>
                    ) : (
                        <div className="mb-10">
                            <div className="bg-white-100 p-6 rounded-lg text-center">
                                <p className="text-16-medium text-black-300">
                                    Aucune biographie disponible
                                </p>
                            </div>
                        </div>
                    )}

                    <hr className="divider" />

                    {/* Startups Section */}
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-7">
                            <h2 className="text-30-bold">
                                Projets présentés
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-30-bold text-primary">
                                    {userStartups?.length || 0}
                                </span>
                                <span className="text-16-medium text-black-300">
                                    {userStartups?.length === 1 ? "projet" : "projets"}
                                </span>
                            </div>
                        </div>

                        <Suspense fallback={<Skeleton className="view_skeleton" />}>
                            {userStartups && userStartups.length > 0 ? (
                                <ul className="card_grid">
                                    {userStartups.map((startup: StartupTypeCard) => (
                                        <StartupCard key={startup._id} post={startup} />
                                    ))}
                                </ul>
                            ) : (
                                <div className="bg-white-100 p-12 rounded-lg text-center">
                                    <p className="text-30-bold text-black-300 mb-2">0</p>
                                    <p className="text-16-medium text-black-300">
                                        Aucun projet présenté pour le moment
                                    </p>
                                </div>
                            )}
                        </Suspense>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserProfilePage;
