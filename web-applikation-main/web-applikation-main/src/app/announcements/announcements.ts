export interface Announcement extends Record<string, any> {
  id: number
  title: string
  description: string
  imageSrc: string
  types: string[]
  state: string
  faculty: string
  institute: string
  professorship: string
  advisor: string
  advisorMail: string
  keywords: string[]
  editLinkToWordpressCms: string
}



