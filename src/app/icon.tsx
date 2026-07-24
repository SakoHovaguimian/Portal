import { strings } from '@/content/strings'
import { ImageResponse } from 'next/og'

export const size = {
  width: 64,
  height: 64,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          background: '#6557E8',
          color: '#FFFFFF',
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        {strings.shared.portal.slice(0, 1)}
      </div>
    ),
    size,
  )
}
