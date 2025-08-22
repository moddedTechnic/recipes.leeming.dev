import {getCollection, getEntry} from 'astro:content'

export async function findSupertags(slug: string) {
    const tags = new Set([slug])
    const tag = await getEntry('tags', slug)
    for (const t of tag?.data?.tags ?? []) {
        for (const st of await findSupertags(t))
            tags.add(st)
    }
    return tags;
}

export async function getRecipe(slug: string) {
    const recipe = await getEntry('recipes', slug)
    if (recipe === undefined)
        return undefined;
    return {
	...recipe.data,
	slug,
	async getTags() {
            const tags = new Set([]);
            for (const tag of this.tags) {
                tags.add(tag)
                for (const supertag of await findSupertags()) {
                    tags.add(supertag)
                }
            }
            return tags;
	}
    }
}

export async function getRecipes() {
    const rawRecipes = await getCollection('recipes')
    const recipes = []
    for (const r of rawRecipes) {
        recipes.push({
            ...r.data,
            slug: r.slug,
	    async getTags() { 
                const tags = new Set([]);
                for (const tag of this.tags) {
                    tags.add(tag)
                    for (const supertag of await findSupertags(tag)) {
                        tags.add(supertag)
                    }
                }

                let ingredientTags = undefined;
                for (const ingredient of this.ingredients) {
                    let slug;
                    if (typeof ingredient === 'string') {
                        slug = ingredient.split(' ')[0]
                    } else {
                        slug = ingredient.name
                    }

                    if (slug.startsWith('#')) {} else {
                        const ingr = await getIngredient(slug)
                        if (ingredientTags === undefined) {
                            ingredientTags = await ingr.getTags()
                        } else {
                            const iTags = await ingr.getTags()
                            ingredientTags = ingredientTags.intersection(iTags)
                        }
                    }
                }

                return tags.union(ingredientTags);
	    }
        })
    }
    return recipes
}

export async function getIngredient(slug: string) {
    const ingredient = await getEntry('ingredients', slug)
    if (ingredient === undefined)
        return undefined;
    return {
        ...ingredient.data,
        slug,
	async getTags() {
            const tags = new Set([]);
            for (const tag of this.tags) {
                tags.add(tag)
                for (const supertag of await findSupertags(tag)) {
                    tags.add(supertag)
                }
            }
            return tags;
	}
    }
}

export async function getTag(slug: string) {
    const tag = await getEntry('tags', slug)
    if (tag === undefined)
	return undefined;
    return {
	...tag.data,
	slug,
    }
}
