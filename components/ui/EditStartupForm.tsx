"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { Send } from "lucide-react";
import { updateStartup } from "@/lib/action";

interface EditStartupFormProps {
    startup: any;
}

export default function EditStartupForm({ startup }: EditStartupFormProps) {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState(startup.pitch || "");
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

    return (
        <form action={formAction} className="startup-form">
            {state.status === "ERROR" && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                    {state.error}
                </div>
            )}

            <div>
                <label htmlFor="title" className="startup-form_label">
                    Titre
                </label>
                <input
                    id="title"
                    name="title"
                    className="startup-form_input"
                    required
                    defaultValue={startup.title}
                    placeholder="Titre du projet"
                />
                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    className="startup-form_textarea"
                    required
                    defaultValue={startup.description}
                    placeholder="Description du projet"
                />
                {errors.description && <p className="startup-form_error">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">
                    Catégorie
                </label>
                <input
                    id="category"
                    name="category"
                    className="startup-form_input"
                    required
                    defaultValue={startup.category}
                    placeholder="Catégorie (Tech, Health, Education...)"
                />
                {errors.category && <p className="startup-form_error">{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="link" className="startup-form_label">
                    Lien de l'image
                </label>
                <input
                    id="link"
                    name="link"
                    className="startup-form_input"
                    required
                    defaultValue={startup.image}
                    placeholder="URL de l'image du projet"
                />
                {errors.link && <p className="startup-form_error">{errors.link}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className="startup-form_label">
                    Pitch
                </label>
                <MDEditor
                    value={pitch}
                    onChange={(value) => setPitch(value as string)}
                    id="pitch"
                    preview="edit"
                    height={300}
                    style={{ borderRadius: 20, overflow: "hidden" }}
                    textareaProps={{
                        placeholder: "Décrivez brièvement votre idée et ce qui la rend unique",
                    }}
                    previewOptions={{
                        disallowedElements: ["style"],
                    }}
                />
                {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    className="startup-form_btn text-white"
                    disabled={isPending}
                >
                    {isPending ? "Mise à jour..." : "Mettre à jour"}
                    <Send className="size-6 ml-2" />
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="startup-form_btn bg-gray-500 text-white hover:bg-gray-600"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}
