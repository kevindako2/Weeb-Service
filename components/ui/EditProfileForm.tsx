"use client";

import { useState, useActionState } from "react";
import { updateAuthorProfile } from "@/lib/action";
import { useRouter } from "next/navigation";
import { Instagram, Twitter, Facebook, Phone, MapPin, Briefcase, Calendar } from "lucide-react";

interface EditProfileFormProps {
    author: any;
    session: any;
}

export default function EditProfileForm({ author, session }: EditProfileFormProps) {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL",
    });

    async function handleFormSubmit(prevState: any, formData: FormData) {
        const result = await updateAuthorProfile(prevState, formData);
        
        if (result.status === "SUCCESS") {
            router.push("/profile");
            router.refresh();
        }
        
        return result;
    }

    return (
        <form action={formAction} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            {state.status === "ERROR" && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {state.error}
                </div>
            )}

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
                            type="url"
                            defaultValue={author?.instagram || ""}
                            placeholder="https://instagram.com/username"
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
                            type="url"
                            defaultValue={author?.twitter || ""}
                            placeholder="https://twitter.com/username"
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
                            type="url"
                            defaultValue={author?.facebook || ""}
                            placeholder="https://facebook.com/username"
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
