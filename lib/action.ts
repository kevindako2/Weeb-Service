"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";

export const incrementViews = async (id: string) => {
    try {
        await writeClient
            .patch(id)
            .setIfMissing({ views: 0 })
            .inc({ views: 1 })
            .commit();

        return { success: true };
    } catch (error) {
        console.error("Error incrementing views:", error);
        return { success: false, error };
    }
};

export const createPitch = async (
    state: any,
    form: FormData,
    pitch: string,
) => {
    const session = await auth();

    if (!session)
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR",
        });

    const { title, description, category, link, authorName } = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== "pitch"),
    );

    const slug = slugify(title as string, { lower: true, strict: true });

    try {
        let authorId = session?.id;
        
        if (authorName && typeof authorName === 'string') {
            const existingAuthor = await client.fetch(
                `*[_type == "author" && name == $name][0]{ _id }`,
                { name: authorName }
            );

            if (existingAuthor) {
                authorId = existingAuthor._id;
            } else {
                const newAuthor = await writeClient.create({
                    _type: "author",
                    name: authorName,
                    username: authorName.toLowerCase().replace(/\s+/g, ''),
                    image: session.user?.image || "",
                    email: session.user?.email || "",
                });
                authorId = newAuthor._id;
            }
        }

        const startup = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: slug,
                current: slug,
            },
            author: {
                _type: "reference",
                _ref: authorId,
            },
            pitch,
            views: 0,
        };

        const result = await writeClient.create({ _type: "startup", ...startup });

        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS",
        });
    } catch (error) {
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};

export const deleteStartup = async (id: string) => {
    const session = await auth();

    if (!session) {
        return parseServerActionResponse({
            error: "Not authenticated",
            status: "ERROR",
        });
    }

    try {
        // UPDATED: Récupérer l'ID de l'auteur via son email
        const authorId = await client.fetch(
            `*[_type == "author" && email == $email][0]._id`,
            { email: session.user?.email }
        );

        if (!authorId) {
            return parseServerActionResponse({
                error: "Author not found",
                status: "ERROR",
            });
        }

        const startup = await client.fetch(
            `*[_type == "startup" && _id == $id][0]{ author->{ _id } }`,
            { id }
        );

        if (!startup || startup.author._id !== authorId) {
            return parseServerActionResponse({
                error: "Unauthorized",
                status: "ERROR",
            });
        }

        await writeClient.delete(id);

        return parseServerActionResponse({
            status: "SUCCESS",
        });
    } catch (error) {
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};

export const updateAuthorProfile = async (
    state: any,
    form: FormData
) => {
    const session = await auth();

    if (!session) {
        return parseServerActionResponse({
            error: "Not authenticated",
            status: "ERROR",
        });
    }

    try {
        const bio = form.get("bio") as string;
        const phone = form.get("phone") as string;
        const country = form.get("country") as string;
        const age = form.get("age") as string;
        const profession = form.get("profession") as string;
        const instagram = form.get("instagram") as string;
        const twitter = form.get("twitter") as string;
        const facebook = form.get("facebook") as string;
        const image = form.get("image") as string;

        const author = await client.fetch(
            `*[_type == "author" && email == $email][0]{ _id }`,
            { email: session.user?.email }
        );

        if (!author) {
            return parseServerActionResponse({
                error: "Author not found",
                status: "ERROR",
            });
        }

        // Préparer les données à mettre à jour et à supprimer
        const updateData: any = {};
        const unsetData: string[] = [];

        // Bio
        if (bio && bio.trim()) {
            updateData.bio = bio.trim();
        } else {
            unsetData.push("bio");
        }

        // Phone
        if (phone && phone.trim()) {
            updateData.phone = phone.trim();
        } else {
            unsetData.push("phone");
        }

        // Country
        if (country && country.trim()) {
            updateData.country = country.trim();
        } else {
            unsetData.push("country");
        }

        // Age
        if (age && age.trim()) {
            updateData.age = parseInt(age);
        } else {
            unsetData.push("age");
        }

        // Profession
        if (profession && profession.trim()) {
            updateData.profession = profession.trim();
        } else {
            unsetData.push("profession");
        }

        // Instagram
        if (instagram && instagram.trim()) {
            updateData.instagram = instagram.trim();
        } else {
            unsetData.push("instagram");
        }

        // Twitter
        if (twitter && twitter.trim()) {
            updateData.twitter = twitter.trim();
        } else {
            unsetData.push("twitter");
        }

        // Facebook
        if (facebook && facebook.trim()) {
            updateData.facebook = facebook.trim();
        } else {
            unsetData.push("facebook");
        }

        // Image
        if (image && image.trim()) {
            updateData.image = image.trim();
        } else {
            unsetData.push("image");
        }

        // Construire la requête de patch
        let patchQuery = writeClient.patch(author._id);

        // Ajouter les champs à mettre à jour
        if (Object.keys(updateData).length > 0) {
            patchQuery = patchQuery.set(updateData);
        }

        // Supprimer les champs vides
        if (unsetData.length > 0) {
            patchQuery = patchQuery.unset(unsetData);
        }

        // Exécuter la requête
        await patchQuery.commit();

        return parseServerActionResponse({
            status: "SUCCESS",
        });
    } catch (error) {
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};

export const updateStartup = async (
    state: any,
    form: FormData,
    pitch: string,
    startupId: string
) => {
    const session = await auth();

    if (!session) {
        return parseServerActionResponse({
            error: "Not authenticated",
            status: "ERROR",
        });
    }

    const { title, description, category, link } = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== "pitch")
    );

    try {
        const startup = await client.fetch(
            `*[_type == "startup" && _id == $id][0]{ author->{ _id } }`,
            { id: startupId }
        );

        const authorId = await client.fetch(
            `*[_type == "author" && email == $email][0]._id`,
            { email: session.user?.email }
        );

        if (!startup || startup.author._id !== authorId) {
            return parseServerActionResponse({
                error: "Unauthorized",
                status: "ERROR",
            });
        }

        const slug = slugify(title as string, { lower: true, strict: true });

        await writeClient
            .patch(startupId)
            .set({
                title,
                description,
                category,
                image: link,
                slug: {
                    _type: "slug",
                    current: slug,
                },
                pitch,
            })
            .commit();

        return parseServerActionResponse({
            status: "SUCCESS",
        });
    } catch (error) {
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};