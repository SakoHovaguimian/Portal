import { strings } from '@/content/strings'
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {

  return {
    name: strings.shared.portal,
    short_name: strings.shared.portal,
    description: strings.metadata.layout.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F8F8',
    theme_color: '#6557E8',
  }

}
