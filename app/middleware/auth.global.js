// middleware/auth.global.js
//import { useCookie } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  //const token = useCookie('auth_token')
  const token = useCookie('authToken')

  // redirect to login if no token
  if (!token && to.path !== '/') {
    return navigateTo('/')
  }
})
