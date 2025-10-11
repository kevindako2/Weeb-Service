// UPDATED: Redesigned to match EditProfileForm design and added delete functionality
"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { FileText, Image as ImageIcon, Tag, Trash2 } from "lucide-react";
import { updateStartup } from "@/lib/action";
import Image from "next/image";

interface EditStartupFormProps {
    startup: any;
}

export default function EditStartupForm({ startup }: EditStartupFormProps) {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState(startup.pitch || "");
    const [isDeleting, setIsDeleting] = useState(false);
    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL",
    });

    async function handleFormSubmit(prevState: any, formData: FormData) {
        const result = await updateStartup(prevState, formData, pitch, startup._id);
        
        if (result.status === "SUCCESS") {
            router.push(`/startup/${startup._id}`);
            router.refresh();
        }
        
        return result;
    }

    // NEW: Delete post functionality
    async function handleDelete() {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/delete-post?id=${startup._id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression");
            }

            // Redirection vers le profil avec notification
            router.push("/profile?deleted=true");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression du post");
            setIsDeleting(false);
        }
    }

    return (
        <form action={formAction} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            {state.status === "ERROR" && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {state.error}
                </div>
            )}

            {/* UPDATED: Added image preview */}
            {startup.image && (
                <div className="flex justify-center">
                    <Image
                        src={startup.image}
                        alt={startup.title}
                        width={400}
                        height={200}
                        className="rounded-lg object-cover"
                    />
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline-block w-4 h-4 mr-2" />
                    Titre
                </label>
                <input
                    id="title"
                    name="title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    defaultValue={startup.title}
                    placeholder="Titre du projet"
                />
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                    defaultValue={startup.description}
                    placeholder="Description courte du projet"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline-block w-4 h-4 mr-2" />
                    Catégorie
                </label>
                <input
                    id="category"
                    name="category"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    defaultValue={startup.category}
                    placeholder="Tech, Health, Education..."
                />
                {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="inline-block w-4 h-4 mr-2" />
                    Lien de l'image
                </label>
                <input
                    id="link"
                    name="link"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    defaultValue={startup.image}
                    placeholder="https://example.com/image.jpg"
                />
                {errors.link && <p className="text-sm text-red-600 mt-1">{errors.link}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-2">
                    Pitch détaillé
                </label>
                <MDEditor
                    value={pitch}
                    onChange={(value) => setPitch(value as string)}
                    id="pitch"
                    preview="edit"
                    height={300}
                    style={{ borderRadius: 8, overflow: "hidden" }}
                    textareaProps={{
                        placeholder: "Décrivez brièvement votre idée et ce qui la rend unique",
                    }}
                    previewOptions={{
                        disallowedElements: ["style"],
                    }}
                />
                {errors.pitch && <p className="text-sm text-red-600 mt-1">{errors.pitch}</p>}
            </div>

            {/* UPDATED: Redesigned buttons to match EditProfileForm */}
            <div className="flex gap-4 pt-6 border-t">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                    {isPending ? "Mise à jour..." : "Enregistrer"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push(`/startup/${startup._id}`)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                    Annuler
                </button>
            </div>

            {/* NEW: Delete button */}
            <div className="pt-4 border-t">
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                    <Trash2 className="w-5 h-5" />
                    {isDeleting ? "Suppression en cours..." : "Supprimer ce post"}
                </button>
                <p className="text-sm text-gray-500 text-center mt-2">
                    ⚠️ Cette action est irréversible
                </p>
            </div>
        </form>
    );
}
