// lib/algolia.ts
// npx ts-node scripts/importToAlgolia.ts  マニュアルで、方法①：投稿がたまってきたら importToAlgolia.ts を定期的に走らせる。方法もある。

import {algoliasearch} from 'algoliasearch'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!

const searchClient = algoliasearch(appId, searchKey)

    export const searchBlogs = async (query: string) => {
    const response = await searchClient.search([
        {
        indexName: 'blogs',
        query,
        params: {
            hitsPerPage: 20,
        },
        },
    ])

    return response.results[0].hits // ✅ ここで hits を取り出す
    }