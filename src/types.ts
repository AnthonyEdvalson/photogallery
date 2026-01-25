export interface ClosetItem {
  id: string
  name: string
  uid: number
  images: string[]
  note: string
  section: string
  tags: string
  collections: string[]
  size: string
}

export type FilterSelection = 
  | { type: 'all' }
  | { type: 'section'; value: string }
  | { type: 'collection'; value: string }

