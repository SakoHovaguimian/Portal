import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'
  const lastModified = new Date()

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
  ]

}
