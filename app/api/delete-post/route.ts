// NEW: API route for deleting a post with authentication and authorization checks
import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("id");

        if (!postId) {
            return NextResponse.json(
                { error: "ID du post manquant" },
                { status: 400 }
            );
        }

        // Vérifier que le post existe et appartient à l'utilisateur
        const post = await client.fetch(
            `*[_type == "startup" && _id == $id][0]{ author->{ email } }`,
            { id: postId }
        );

        if (!post) {
            return NextResponse.json(
                { error: "Post introuvable" },
                { status: 404 }
            );
        }

        if (post.author.email !== session.user.email) {
            return NextResponse.json(
                { error: "Non autorisé à supprimer ce post" },
                { status: 403 }
            );
        }

        // Supprimer le post
        await writeClient.delete(postId);

        return NextResponse.json({
            success: true,
            message: "Post supprimé avec succès",
        });
    } catch (error) {
        console.error("Erreur suppression post:", error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression" },
            { status: 500 }
        );
    }
}
