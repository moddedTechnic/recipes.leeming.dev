import {defineCollection, z} from 'astro:content'

const recipesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        tags: z.array(z.string()),
        createdDate: z.string().date(),
        modifiedDate: z.optional(z.string().date()),
        ingredients: z.array(z.union([
            z.string(),
            z.object({
                name: z.string(),
                plural: z.optional(z.boolean()),
                quantity: z.optional(z.union([z.string(), z.number()])),
                notes: z.optional(z.string()),
            }),
        ])),
    }),
})

const ingredientsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        plural: z.optional(z.string()),
        tags: z.array(z.string()),
        createdDate: z.string().date(),
        modifiedDate: z.optional(z.string().date()),
    }),
})

const tagsCollection = defineCollection({
    type: 'content',
    schema: z.object({
	name: z.string(),
	plural: z.optional(z.string()),
	tags: z.array(z.string()),
	createdDate: z.string().date(),
	modifiedDate: z.optional(z.string().date()),
    })
})

export const collections = {
    'ingredients': ingredientsCollection,
    'recipes': recipesCollection,
    'tags': tagsCollection,
}
