export default defineNuxtRouteMiddleware(({ path }) => {
  const user = useSupabaseUser()
  if (!user.value && path !== '/login' && path !== '/sign-in') {
    return navigateTo({ path: '/login' });
  }
});
