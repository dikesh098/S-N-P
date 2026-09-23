import { supabase, BUCKET } from './supabase'

/** Resize + convert to WebP in the browser, so uploads stay tiny (free-tier friendly). */
export async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image'))), 'image/webp', quality),
  )
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

async function putBlob(blob: Blob, folder: string): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured')
  const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg'
  const path = `${folder}/${uid()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: '31536000',
    contentType: blob.type,
  })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

export async function uploadImage(file: File, folder: string, maxDim = 1600): Promise<string> {
  return putBlob(await compressImage(file, maxDim), folder)
}

/** Uploads a full-size image and a small thumbnail. */
export async function uploadWithThumb(file: File, folder: string) {
  const [full, thumb] = await Promise.all([compressImage(file, 1600, 0.82), compressImage(file, 520, 0.72)])
  const [image_url, thumb_url] = await Promise.all([putBlob(full, folder), putBlob(thumb, `${folder}/thumbs`)])
  return { image_url, thumb_url }
}
