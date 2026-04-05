import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  try {
    const { data, error } = await supabase.storage.from('fragrances').list()
    if (error) {
      console.error('Error listing storage:', error)
      return
    }
    console.log(`FOUND ${data.length} files in bucket 'fragrances'`)
    data.forEach(f => console.log(`FILE: ${f.name}`))
  } catch (error) {
    console.error('Error in debug script:', error)
  }
}

main()
