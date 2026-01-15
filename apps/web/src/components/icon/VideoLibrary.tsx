import type { SVGProps } from 'react'

/**
 * VideoLibraryアイコン（クリップ用）
 */
export const VideoLibrary = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
      aria-label="Video Library"
      {...props}
    >
      <title>Video Library</title>
      <path d="M240-160q-33 0-56.5-23.5T160-240v-480q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v480q0 33-23.5 56.5T720-160H240Zm0-80h480v-480H240v480Zm-80 240q-33 0-56.5-23.5T80-80v-560h80v560h560v80H160Zm360-400 160-100-160-100v200Z" />
    </svg>
  )
}
