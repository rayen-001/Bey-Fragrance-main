import { Hono } from 'hono'
import { getSupabase } from '../db/supabase.js'
import { authMiddleware } from '../middleware/auth.js'
import { prisma } from '../db/prisma.js'

const upload = new Hono()

// Only ADMINs can upload
upload.use('*', authMiddleware)


/**
 * POST /upload
 * Expects a multipart/form-data body with a 'file' field.
 * Optional: 'productId' to automatically update the product record.
 * Optional: 'isMain' (boolean) to set as mainImage instead of galleryImages.
 */
upload.post('/', async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body['file'] as File
    const productId = body['productId'] as string
    const isMain = body['isMain'] === 'true'

    if (!file) {
      return c.json({ success: false, error: 'No file uploaded' }, 400)
    }

    // Prepare file for Supabase
    const buffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`
    
    // Upload to 'fragrances' bucket
    const { data, error } = await getSupabase().storage
      .from('fragrances')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('[Supabase Upload Error]:', error.message, error.stack);
      return c.json({ success: false, error: `Upload to storage failed: ${error.message}` }, 500)
    }

    // Get public URL
    const { data: { publicUrl } } = getSupabase().storage
      .from('fragrances')
      .getPublicUrl(fileName)

    // Sync with Database if productId is provided
    if (productId) {
      try {
        if (isMain) {
          await prisma.product.update({
            where: { id: productId },
            data: { mainImage: publicUrl }
          })
        } else {
          await prisma.product.update({
            where: { id: productId },
            data: { 
              galleryImages: {
                push: publicUrl
              }
            }
          })
        }
        console.log(`[Upload] Updated product ${productId} with new image URL`)
      } catch (dbError) {
        console.error('[Upload] Database sync failed:', dbError)
        // We still return the publicUrl so the frontend can handle it
      }
    }

    return c.json({ 
      success: true, 
      image_url: publicUrl 
    })
  } catch (error) {
    console.error('Upload route error:', error)
    return c.json({ success: false, error: 'Internal Server Error' }, 500)
  }
})

export default upload
