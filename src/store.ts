import { User } from "@supabase/gotrue-js"
import { reactive } from "vue"
import { Profile } from "./interface"

export const userState = reactive({
  user: {} as User | null,
  profiles: {} as Profile | null,
})
