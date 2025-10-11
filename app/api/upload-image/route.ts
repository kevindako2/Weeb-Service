import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "Aucun fichier fourni" },
                { status: 400 }
            );
        }

        // Vérifier le type de fichier
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Le fichier doit être une image" },
                { status: 400 }
            );
        }

        // Convertir le fichier en buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload vers Sanity
        const asset = await writeClient.assets.upload("image", buffer, {
            filename: file.name,
            contentType: file.type,
        });

        return NextResponse.json({
            url: asset.url,
            assetId: asset._id,
        });
    } catch (error) {
        console.error("Erreur upload image:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'upload" },
            { status: 500 }
        );
    }
}
