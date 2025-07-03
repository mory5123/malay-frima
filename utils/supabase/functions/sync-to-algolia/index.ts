// supabase/functions/sync-to-algolia/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import {algoliasearch} from 'algoliasearch'
import 'https://deno.land/std@0.177.0/dotenv/load.ts'

const ALGOLIA_APP_ID = Deno.env.get('ALGOLIA_APP_ID')!
const ALGOLIA_ADMIN_KEY = Deno.env.get('ALGOLIA_ADMIN_KEY')!
const ALGOLIA_INDEX = 'blogs'

    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)
    const index = client.initIndex(ALGOLIA_INDEX)

    serve(async (req) => {
    const { type, record } = await req.json()

    console.log(`[Algolia Sync] Event Type: ${type}`)

    if (!record?.id) {
        return new Response('Missing record', { status: 400 })
    }

    try {
        if (type === 'INSERT' || type === 'UPDATE') {
        const object = { ...record, objectID: record.id }
        await index.saveObject(object)
        return new Response('Indexed!', { status: 200 })
        } else if (type === 'DELETE') {
        await index.deleteObject(record.id.toString())
        return new Response('Deleted!', { status: 200 })
        }

        return new Response('Unknown event type', { status: 400 })
    } catch (error) {
        console.error('[Algolia Sync Error]', error)
        return new Response('Sync failed', { status: 500 })
    }
    })
