"use client";

import { useState, useActionState } from "react";
import { updateAuthorProfile } from "@/lib/action";
import { useRouter } from "next/navigation";
import { Instagram, Twitter, Facebook, Phone, MapPin, Briefcase, Calendar, Upload, X } from "lucide-react";
import Image from "next/image";

interface EditProfileFormProps {
    author: any;
    session: any;
}

export default function EditProfileForm({ author, session }: EditProfileFormProps) {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imageUrl, setImageUrl] = useState(author?.image || session.user?.image || "");
    const [isUploading, setIsUploading] = useState(false);
    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL",
    });

    async function handleFormSubmit(prevState: any, formData: FormData) {
        // Ajouter l'URL de l'image au formData
        formData.set("image", imageUrl);
        
        const result = await updateAuthorProfile(prevState, formData);
        
        if (result.status === "SUCCESS") {
            router.push("/profile");
            router.refresh();
        }
        
        return result;
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'upload");
            }

            const data = await response.json();
            setImageUrl(data.url);
        } catch (error) {
            console.error(error);
            setErrors({ image: "Erreur lors de l'upload de l'image" });
        } finally {
            setIsUploading(false);
        }
    }

    function removeImage() {
        setImageUrl("");
    }

    return (
        <form action={formAction} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            {state.status === "ERROR" && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {state.error}
                </div>
            )}

            {/* Upload d'image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil
                </label>
                <div className="flex items-center gap-6">
                    {imageUrl ? (
                        <div className="relative">
                            <Image
                                src={imageUrl}
                                alt="Photo de profil"
                                width={100}
                                height={100}
                                className="rounded-full object-cover border-4 border-primary/20"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                title="Supprimer l'image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                    
                    <div className="flex-1">
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="hidden"
                        />
                        <label
                            htmlFor="image-upload"
                            className={`inline-block px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors ${
                                isUploading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isUploading ? "Upload en cours..." : "Choisir une image"}
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                            JPG, PNG ou GIF (max 5MB)
                        </p>
                        {errors.image && (
                            <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    defaultValue={author?.bio || ""}
                    placeholder="Parlez-nous de vous..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline-block w-4 h-4 mr-2" />
                        Téléphone
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={author?.phone || ""}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline-block w-4 h-4 mr-2" />
                        Pays
                    </label>
                    <input
                        id="country"
                        name="country"
                        type="text"
                        defaultValue={author?.country || ""}
                        placeholder="France"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline-block w-4 h-4 mr-2" />
                        Âge
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        min="1"
                        max="120"
                        defaultValue={author?.age || ""}
                        placeholder="25"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="inline-block w-4 h-4 mr-2" />
                        Profession
                    </label>
                    <input
                        id="profession"
                        name="profession"
                        type="text"
                        defaultValue={author?.profession || ""}
                        placeholder="Développeur Full Stack"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* UPDATED: Changed social media fields to username format instead of full URLs */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Réseaux sociaux</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                            <Instagram className="inline-block w-4 h-4 mr-2" />
                            Instagram
                        </label>
                        <input
                            id="instagram"
                            name="instagram"
                            type="text"
                            defaultValue={author?.instagram || ""}
                            placeholder="@username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                            <Twitter className="inline-block w-4 h-4 mr-2" />
                            Twitter
                        </label>
                        <input
                            id="twitter"
                            name="twitter"
                            type="text"
                            defaultValue={author?.twitter || ""}
                            placeholder="@username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                            <Facebook className="inline-block w-4 h-4 mr-2" />
                            Facebook
                        </label>
                        <input
                            id="facebook"
                            name="facebook"
                            type="text"
                            defaultValue={author?.facebook || ""}
                            placeholder="@username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-6">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                    {isPending ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/profile")}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}
