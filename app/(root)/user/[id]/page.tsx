import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY, STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import StartupCard, { StartupTypeCard } from "@/components/ui/StartupCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, MapPin, Calendar, Briefcase, Instagram, Twitter, Facebook } from "lucide-react";

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
                    <div className="mb-10">
                        <h2 className="text-30-bold mb-4">À propos</h2>
                        <div className="bg-white p-6 rounded-lg shadow-100 space-y-6">
                            <p className="text-16-medium text-black-300 leading-relaxed">
                                {user.bio || "Aucune bio encore configurée"}
                            </p>

                            {(user.phone || user.country || user.age || user.profession) && (
                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-20-semibold mb-4">Informations</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-primary" />
                                                <span className="text-16-medium text-black-300">{user.phone}</span>
                                            </div>
                                        )}
                                        {user.country && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-primary" />
                                                <span className="text-16-medium text-black-300">{user.country}</span>
                                            </div>
                                        )}
                                        {user.age && (
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                <span className="text-16-medium text-black-300">{user.age} ans</span>
                                            </div>
                                        )}
                                        {user.profession && (
                                            <div className="flex items-center gap-3">
                                                <Briefcase className="w-5 h-5 text-primary" />
                                                <span className="text-16-medium text-black-300">{user.profession}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* UPDATED: Social media links now use username format and build proper URLs */}
                            {(user.instagram || user.twitter || user.facebook) && (
                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-20-semibold mb-4">Réseaux sociaux</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {user.instagram && (
                                            <a 
                                                href={user.instagram.startsWith('@') 
                                                    ? `https://instagram.com/${user.instagram.slice(1)}` 
                                                    : `https://instagram.com/${user.instagram}`
                                                } 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                <Instagram className="w-5 h-5" />
                                                {user.instagram}
                                            </a>
                                        )}
                                        {user.twitter && (
                                            <a 
                                                href={user.twitter.startsWith('@') 
                                                    ? `https://twitter.com/${user.twitter.slice(1)}` 
                                                    : `https://twitter.com/${user.twitter}`
                                                } 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                <Twitter className="w-5 h-5" />
                                                {user.twitter}
                                            </a>
                                        )}
                                        {user.facebook && (
                                            <a 
                                                href={user.facebook.startsWith('@') 
                                                    ? `https://facebook.com/${user.facebook.slice(1)}` 
                                                    : `https://facebook.com/${user.facebook}`
                                                } 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                <Facebook className="w-5 h-5" />
                                                {user.facebook}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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
