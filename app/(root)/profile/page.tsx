import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { Suspense } from "react";
import StartupCard, { StartupTypeCard } from "@/components/ui/StartupCard";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export const experimental_ppr = true;

const ProfilePage = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    // Essayer de trouver l'auteur Sanity correspondant
    const sanityAuthor = await client.fetch(
        `*[_type == "author" && email == $email][0]{
            _id,
            name,
            username,
            email,
            image,
            bio
        }`,
        { email: session.user.email }
    );

    // Récupérer les projets si l'auteur existe dans Sanity
    let userStartups = [];
    if (sanityAuthor?._id) {
        userStartups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id: sanityAuthor._id });
    }

    return (
        <>
            <section className="pink_container !min-h-[320px]">
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                        <Image
                            src={session.user.image || sanityAuthor?.image || "https://cdn.pixabay.com/photo/2018/04/20/21/10/code-3337044_1280.jpg"}
                            alt={session.user.name || "User"}
                            width={200}
                            height={200}
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="heading !mb-2">{session.user.name || sanityAuthor?.name || "Utilisateur"}</h1>
                        {(session.user.email || sanityAuthor?.email) && (
                            <p className="sub-heading !max-w-5xl !mb-0">{session.user.email || sanityAuthor?.email}</p>
                        )}
                        {sanityAuthor?.username && (
                            <p className="text-16-medium text-white-100 mt-2">@{sanityAuthor.username}</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="section_container">
                <div className="max-w-5xl mx-auto">
                    {/* Bio Section */}
                    {sanityAuthor?.bio ? (
                        <div className="mb-10">
                            <h2 className="text-30-bold mb-4">À propos</h2>
                            <p className="text-16-medium text-black-300 leading-relaxed bg-white p-6 rounded-lg shadow-100">
                                {sanityAuthor.bio}
                            </p>
                        </div>
                    ) : (
                        <div className="mb-10">
                            <div className="bg-white-100 p-6 rounded-lg">
                                <h3 className="text-20-semibold mb-2">Informations du compte</h3>
                                <div className="space-y-2 text-16-medium text-black-300">
                                    <p><strong>Nom:</strong> {session.user.name || "Non renseigné"}</p>
                                    <p><strong>Email:</strong> {session.user.email || "Non renseigné"}</p>
                                </div>
                                {!sanityAuthor && (
                                    <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                                        <p className="text-14-medium text-black-300">
                                            💡 Créez votre premier projet pour apparaître dans la communauté !
                                        </p>
                                        <Link 
                                            href="/startup/create" 
                                            className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            Créer un projet
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <hr className="divider" />

                    {/* Startups Section */}
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-7">
                            <h2 className="text-30-bold">
                                Mes projets
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
                                    <p className="text-16-medium text-black-300">
                                        Vous n'avez pas encore de projet
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

export default ProfilePage;
