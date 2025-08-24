import {defineCollection, z} from 'astro:content'

const recipesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        tags: z.array(z.string()),
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
    }),
})

const tagsCollection = defineCollection({
    type: 'content',
    schema: z.object({
	name: z.string(),
	plural: z.optional(z.string()),
	tags: z.array(z.string()),
    })
})

export const collections = {
    'ingredients': ingredientsCollection,
    'recipes': recipesCollection,
    'tags': tagsCollection,
}
