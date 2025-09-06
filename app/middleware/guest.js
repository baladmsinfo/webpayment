export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('authToken')

  // If token exists and user is on login/register, redirect to dashboard
  if (token.value && (to.path === '/' || to.path === '/register')) {
    return navigateTo('/merchant')
  }
})