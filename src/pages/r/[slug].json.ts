import {getCollection} from 'astro:content'

export async function getStaticPaths() {
  const recipes = await getCollection('recipes')
  return recipes.map((recipe) => ({
    params: {slug: recipe.slug},
    props: {
      recipe,
    },
  }))
}

export async function GET({params, props, request}) {
  const {recipe} = props
  const {name, ingredients} = recipe.data
  return new Response(
    JSON.stringify({
      name,
      ingredients: ingredients.map(i => {
        if (typeof i === "string") {
          const parts = i.split(' ')
          return { name: parts[0], quantity: parts[1] }
        }
        return i
      }),
      content: recipe.body
    }),
    { headers: { "Content-Type": "application/json" } }
  )
}
