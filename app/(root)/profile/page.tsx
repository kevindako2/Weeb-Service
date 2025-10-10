import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { Suspense } from "react";
import StartupCardWithDelete, { StartupTypeCard } from "@/components/ui/StartupCardWithDelete";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Phone, MapPin, Calendar, Briefcase, Instagram, Twitter, Facebook } from "lucide-react";

export const experimental_ppr = true;

const ProfilePage = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const sanityAuthor = await client.fetch(
        `*[_type == "author" && email == $email][0]{
            _id,
            name,
            username,
            email,
            image,
            bio,
            phone,
            country,
            age,
            profession,
            instagram,
            twitter,
            facebook
        }`,
        { email: session.user.email }
    );

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
                    <div className="mb-10">
                        <h2 className="text-30-bold mb-4">À propos</h2>
                        <div className="bg-white p-6 rounded-lg shadow-100 space-y-6">
                            <p className="text-16-medium text-black-300 leading-relaxed">
                                {sanityAuthor?.bio || "Aucune bio encore configurée"}
                            </p>

                            {(sanityAuthor?.phone || sanityAuthor?.country || sanityAuthor?.age || sanityAuthor?.profession) && (
                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-20-semibold mb-4">Informations</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sanityAuthor?.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-primary" />
                                                <span className="text-16-medium text-black-300">{sanityAuthor.phone}</span>
                                            </div>
                                        )}
                                        {sanityAuthor?.country && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-primary" />
                                                <span className="text-16-medium text-black-300">{sanityAuthor.country}</span>
                                            </div>
                                        )}
                                        {sanityAuthor?.age && (
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                <span className="text-16-medium text-black-300">{sanityAuthor.age} ans</span>
                                            </div>
                                        )}
                                        {sanityAuthor?.profession && (
                                            <div className="flex items-center gap-3">
                                                <Briefcase className="w-5 h-5 text-primary" />
                                                <span className="text-16-medium text-black-300">{sanityAuthor.profession}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {(sanityAuthor?.instagram || sanityAuthor?.twitter || sanityAuthor?.facebook) && (
                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-20-semibold mb-4">Réseaux sociaux</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {sanityAuthor?.instagram && (
                                            <a 
                                                href={sanityAuthor.instagram} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                <Instagram className="w-5 h-5" />
                                                Instagram
                                            </a>
                                        )}
                                        {sanityAuthor?.twitter && (
                                            <a 
                                                href={sanityAuthor.twitter} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                <Twitter className="w-5 h-5" />
                                                Twitter
                                            </a>
                                        )}
                                        {sanityAuthor?.facebook && (
                                            <a 
                                                href={sanityAuthor.facebook} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                <Facebook className="w-5 h-5" />
                                                Facebook
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
                                        <StartupCardWithDelete key={startup._id} post={startup} />
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
