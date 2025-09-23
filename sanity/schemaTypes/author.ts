import {defineCliConfig} from "sanity/cli";
import {defineField, defineType} from "sanity";
import {title} from "valibot";
import {type} from "node:os";
import {UserIcon} from "lucide-react";


export const author = defineType({
    name:"author",
    title: "Author",
    type:'document',
    icon: UserIcon,
    fields: [
        defineField({
            name:'id',
            type:'number',
        }),
        defineField({
            name:'name',
            type:'string',
        }),
        defineField({
            name:'username',
            type:'string',
        }),
        defineField({
            name:'email',
            type:'string',
        }),
        defineField({
            name:'image',
            type:'url',
        }),
        defineField({
            name:'bio',
            type:'text',
        }),
    ],
    preview: {
        select: {
            title:"name",
        }
    }
})