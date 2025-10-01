"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {createPitch} from "@/lib/action";
import { Session } from "next-auth";

interface Author {
    _id: string;
    name: string;
    username?: string;
    image?: string;
}

interface StartupFormProps {
    authors: Author[];
    session: Session;
}

const StartupForm = ({ authors, session }: StartupFormProps) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState("");
    const [authorName, setAuthorName] = useState(session.user?.name || "");
    const [filteredAuthors, setFilteredAuthors] = useState<Author[]>(authors);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleAuthorChange = (value: string) => {
        setAuthorName(value);
        if (value.trim()) {
            const filtered = authors.filter(author =>
                author.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAuthors(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredAuthors(authors);
            setShowSuggestions(false);
        }
    };

    const selectAuthor = (author: Author) => {
        setAuthorName(author.name);
        setShowSuggestions(false);
    };

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                link: formData.get("link") as string,
                authorName: formData.get("authorName") as string,
                pitch,
            };

            await formSchema.parseAsync(formValues);

            const result = await createPitch(prevState, formData, pitch);

            if (result.status == "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Your startup pitch has been created successfully",
                });

                router.push(`/startup/${result._id}`);
            }

            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErorrs = error.flatten().fieldErrors;

                setErrors(fieldErorrs as unknown as Record<string, string>);

                toast({
                    title: "Error",
                    description: "Please check your inputs and try again",
                    variant: "destructive",
                });

                return { ...prevState, error: "Validation failed", status: "ERROR" };
            }

            toast({
                title: "Error",
                description: "An unexpected error has occurred",
                variant: "destructive",
            });

            return {
                ...prevState,
                error: "An unexpected error has occurred",
                status: "ERROR",
            };
        }
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL",
    });

    return (
        <form action={formAction} className="startup-form">
            <div>
                <label htmlFor="title" className="startup-form_label">
                    Title
                </label>
                <Input
                    id="title"
                    name="title"
                    className="startup-form_input"
                    required
                    placeholder="Startup Title"
                />

                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">
                    Description
                </label>
                <Textarea
                    id="description"
                    name="description"
                    className="startup-form_textarea"
                    required
                    placeholder="Startup Description"
                />

                {errors.description && (
                    <p className="startup-form_error">{errors.description}</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">
                    Category
                </label>
                <Input
                    id="category"
                    name="category"
                    className="startup-form_input"
                    required
                    placeholder="Startup Category (Tech, Health, Education...)"
                />

                {errors.category && (
                    <p className="startup-form_error">{errors.category}</p>
                )}
            </div>

            <div>
                <label htmlFor="link" className="startup-form_label">
                    Image URL
                </label>
                <Input
                    id="link"
                    name="link"
                    className="startup-form_input"
                    required
                    placeholder="Startup Image URL"
                />

                {errors.link && <p className="startup-form_error">{errors.link}</p>}
            </div>

            <div className="relative">
                <label htmlFor="authorName" className="startup-form_label">
                    Author Name
                </label>
                <Input
                    id="authorName"
                    name="authorName"
                    className="startup-form_input"
                    required
                    placeholder="Enter author name"
                    value={authorName}
                    onChange={(e) => handleAuthorChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />

                {showSuggestions && filteredAuthors.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredAuthors.map((author) => (
                            <button
                                key={author._id}
                                type="button"
                                onClick={() => selectAuthor(author)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            >
                                {author.image && (
                                    <img
                                        src={author.image}
                                        alt={author.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <p className="font-medium">{author.name}</p>
                                    {author.username && (
                                        <p className="text-sm text-gray-500">@{author.username}</p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {errors.authorName && <p className="startup-form_error">{errors.authorName}</p>}
                <p className="text-sm text-gray-500 mt-1">
                    Start typing to select an existing author or enter a new name
                </p>
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
                        placeholder:
                            "Briefly describe your idea and what problem it solves",
                    }}
                    previewOptions={{
                        disallowedElements: ["style"],
                    }}
                />

                {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
            </div>

            <Button
                type="submit"
                className="startup-form_btn text-white"
                disabled={isPending}
            >
                {isPending ? "Submitting..." : "Submit Your Pitch"}
                <Send className="size-6 ml-2" />
            </Button>
        </form>
    );
};

export default StartupForm;