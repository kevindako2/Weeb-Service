// NEW: Shared form container component for consistent styling across Edit Profile and Edit Post
import React from "react";

interface FormContainerProps {
    children: React.ReactNode;
    title: string;
}

export default function FormContainer({ children, title }: FormContainerProps) {
    return (
        <section className="pink_container !min-h-screen">
            <div className="max-w-3xl mx-auto py-10">
                <h1 className="heading text-center mb-10">{title}</h1>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    {children}
                </div>
            </div>
        </section>
    );
}
