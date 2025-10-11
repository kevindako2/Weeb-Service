// UPDATED: Redesigned to match Edit Profile page layout and style
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import EditStartupForm from "@/components/ui/EditStartupForm";

const EditStartupPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const session = await auth();
    const id = (await params).id;

    if (!session?.user) {
        redirect("/");
    }

    const startup = await client.fetch(STARTUP_BY_ID_QUERY, { id });

    if (!startup) {
        return notFound();
    }

    // Vérifier que l'utilisateur est bien l'auteur du post
    const authorId = await client.fetch(
        `*[_type == "author" && email == $email][0]._id`,
        { email: session.user.email }
    );

    if (startup.author._id !== authorId) {
        redirect("/");
    }

    return (
        <section className="pink_container !min-h-screen">
            <div className="max-w-3xl mx-auto py-10">
                <h1 className="heading text-center mb-10">Modifier mon projet</h1>
                <EditStartupForm startup={startup} />
            </div>
        </section>
    );
};

export default EditStartupPage;
