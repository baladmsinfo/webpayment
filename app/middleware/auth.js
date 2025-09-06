// middleware/auth.js
//import { useCookie } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  //const token = useCookie('auth_token')
  const token = useCookie('authToken')
  if (!token) {
    return navigateTo('/')
  }
})
