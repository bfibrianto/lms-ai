export interface TrainingListItem {
  id: string
  title: string
  type: string
  status: string
  startDate: Date
  endDate: Date
  location: string | null
  onlineUrl: string | null
  capacity: number | null
  creator: { name: string }
  _count: { registrations: number }
}

export interface TrainingDetail extends TrainingListItem {
  description: string | null
  cover: string | null
  creatorId: string
  registrations: {
    id: string
    status: string
    registeredAt: Date
    user: { id: string; name: string; email: string; department: string | null }
  }[]
}
