"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";

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