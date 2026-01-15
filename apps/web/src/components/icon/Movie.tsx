import type { SVGProps } from 'react'

/**
 * Movieアイコン（ショーリール用）
 */
export const Movie = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
      aria-label="Movie"
      {...props}
    >
      <title>Movie</title>
      <path d="M160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Zm0-80h640v-640H160v640Zm80-80h480v-80H240v80Zm0-400h480v-80H240v80Zm0 200h480v-80H240v80Z" />
    </svg>
  )
}
