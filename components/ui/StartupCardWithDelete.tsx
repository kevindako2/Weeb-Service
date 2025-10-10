"use client";

import React, { useState } from 'react';
import {formatDate} from "@/lib/utils";
import {EyeIcon, Trash2, Edit, MoreVertical} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {Author, Startup} from "@/sanity/types";
import { deleteStartup } from "@/lib/action";
import { useRouter } from "next/navigation";

export type StartupTypeCard =Omit<Startup, "author"> & { author?: Author}

function StartupCardWithDelete({post} : {post: StartupTypeCard}) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { _createdAt,
            views,
            author,
            title,
            category,
            _id,
            image,
            description } = post;

    const handleDelete = async () => {
        setIsMenuOpen(false);
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteStartup(_id);
            if (result.status === "SUCCESS") {
                router.refresh();
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = () => {
        setIsMenuOpen(false);
        router.push(`/startup/${_id}/edit`);
    };

    return (
        <li className={"startup-card group relative"}>
            <div className={"flex-between"}>
                <p className={"startup_card_date"}>
                     {formatDate(_createdAt)}
                </p>
                <div className={"flex gap-1.5"}>
                    <EyeIcon className={"size-6 text-primary"} />
                    <span className={"text-16-medium"}>{views}</span>
                </div>
            </div>
            <div className={"flex-between mt-5 gap-5"}>
                <div className={"flex-1"}>
                    <Link href={`/user/${author?._id}`}>
                        <h3 className={"text-16-medium line-clamp-1"}>
                            {author?.name}
                        </h3>
                    </Link>
                    <Link href={`/startup/${_id}`}>
                        <h3 className={"text-26-semibold line-clamp-1"}>{title}</h3>
                    </Link>
                </div>

                        <Link href={`/user/${author?._id}`}>
                            <Image src={author?.image || 'https://cdn.pixabay.com/photo/2018/04/20/21/10/code-3337044_1280.jpg'} alt={"placeholder"} width={48} height={48} className="rounded-full" />
                        </Link>


            </div>

            <Link href={`/startup/${_id}`}>
                <p className="startup_card_desc">
                    {description}
                </p>
                <img
                    src={image}
                    alt="placeholder"
                    width={600}
                    height={400}
                    className="startup-card_img"
                />
            </Link>
            <div className={"flex-between gap-3 mt-5"}>
                <Link href={`/?query=${category?.toLowerCase()}`}>
                    <p className={"text-16-medium"}>{category}</p>
                </Link>

                <div className="flex items-center gap-2">
                    <Button className={"startup-card_btn"} asChild>
                        <Link href={`/startup/${_id}`}>
                            Details
                        </Link>
                    </Button>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Options"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                    <div className="py-1">
                                        <button
                                            onClick={handleEdit}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Éditer
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {isDeleting ? "Suppression..." : "Supprimer"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
}
export default StartupCardWithDelete;
