import {defineCliConfig} from "sanity/cli";
import {defineField, defineType} from "sanity";
import {title} from "valibot";
import {type} from "node:os";
import {UserIcon} from "lucide-react";


export const startup = defineType({
    name:"startup",
    title: "startup",
    type:'document',
    fields: [
        defineField({
            name:"title",
            type:"string",
        }),
        defineField({
            name:"slug",
            type:"slug",
            options:{
                source: "tile"
            }
        }),
        defineField({
            name:"author",
            type:"reference",
            to:{ type: "author"},
        }),
        defineField({
            name:"views",
            type:"number",
        }),
        defineField({
            name:"description",
            type:"text",
        }),
        defineField({
            name:"category",
            type:"string",
            validation: (Rule) => Rule.min(1).max(20).required().error("Please enter a category"),
        }),
        defineField({
            name:"image",
            type:"url",
            validation: (Rule) => Rule.required().error("Please enter a image"),
        }),
        defineField({
            name:"pitch",
            type:"markdown",
        }),
    ],
});

