import type { SVGProps } from 'react'

import { MovieFill } from '@/components/icon'

export type NavItem = {
  href: string
  icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element
  label: string
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/reels',
    icon: MovieFill,
    label: 'ショーリール',
  },
]
