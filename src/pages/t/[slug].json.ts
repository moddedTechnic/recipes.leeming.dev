import {getCollection} from 'astro:content'

import {findSupertags} from '../../utils/collections'

export async function getStaticPaths() {
    const tags = await getCollection('tags')
    return tags.map((tag) => ({
        params: {slug: tag.slug},
        props: {
            tag,
        },
    }))
}

export async function GET({params, props, request}) {
    const {tag} = props
    const {name} = tag.data
    
    const tags = [];
    for (const t of tag.data.tags) {
        if (!tags.includes(t))
            tags.push(t)
        for (const st of await findSupertags(t)) {
            if (!tags.includes(st))
                tags.push(st)
        }
    }

    return new Response(
        JSON.stringify({
            name,
            tags,
        }),
        { headers: { "Content-Type": "application/json" } }
    )
}
