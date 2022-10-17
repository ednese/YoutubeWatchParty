<template>
  <signInForm @submit="signUp" />
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const { push } = useRouter()

async function signUp({email, password}) {
  const { error } = await client.auth.signUp({
    email,
    password,
  })
  if (error) window.alert(error.message)
  else push('/login')
}
</script>
