import { User } from "@supabase/gotrue-js"
import { reactive } from "vue"

export const userState = reactive({
  user: {} as User | null,
})
