import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'
import { algoliasearch } from 'algoliasearch'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const client = algoliasearch(
    process.env.ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
    )

    async function main() {
    const { data, error } = await supabase.from('blogs').select('*')
    if (error) {
        console.error('❌ Supabase error:', error)
        return
    }

    const records = data.map((item: any) => ({
        objectID: item.id,
        ...item
    }))

    await client.saveObjects({
        indexName: 'blogs',
        objects: records
    })

    console.log(`✅ Algoliaに ${records.length} 件インポート完了！`)
}

main()
