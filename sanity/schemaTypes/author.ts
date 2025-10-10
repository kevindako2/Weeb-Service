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
        defineField({
            name:'phone',
            type:'string',
        }),
        defineField({
            name:'country',
            type:'string',
        }),
        defineField({
            name:'age',
            type:'number',
        }),
        defineField({
            name:'profession',
            type:'string',
        }),
        defineField({
            name:'instagram',
            type:'url',
        }),
        defineField({
            name:'twitter',
            type:'url',
        }),
        defineField({
            name:'facebook',
            type:'url',
        }),
    ],
    preview: {
        select: {
            title:"name",
        }
    }
})