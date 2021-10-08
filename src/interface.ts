export interface Profile {
  id: string
  username: string
  avatar_url: string
  introduction: string
  links: string[]
  full_name: string
}

export interface Story {
  id: string
  user_id: string
  date: string
  story: string
  tagging: string[]
  image: string
}
