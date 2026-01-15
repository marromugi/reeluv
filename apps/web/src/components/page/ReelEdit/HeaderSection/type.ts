/** HeaderSection の Props */
export type HeaderSectionProps = {
  name: string
  onUpdateName: (name: string) => Promise<void>
  isUpdating: boolean
}
