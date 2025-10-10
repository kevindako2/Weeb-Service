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
        const startup = await client.fetch(
            `*[_type == "startup" && _id == $id][0]{ author->{ _id } }`,
            { id }
        );

        if (!startup || startup.author._id !== session.id) {
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

        const updateData: any = {};
        if (bio) updateData.bio = bio;
        if (phone) updateData.phone = phone;
        if (country) updateData.country = country;
        if (age) updateData.age = parseInt(age);
        if (profession) updateData.profession = profession;
        if (instagram) updateData.instagram = instagram;
        if (twitter) updateData.twitter = twitter;
        if (facebook) updateData.facebook = facebook;
        if (image) updateData.image = image;

        await writeClient
            .patch(author._id)
            .set(updateData)
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