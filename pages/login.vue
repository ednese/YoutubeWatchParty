<template>
  <loginForm @submit="login" />
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const { push } = useRouter()

async function login({email, password}) {
  const { error } = await client.auth.signIn({
    email,
    password,
  })
  if (error) window.alert(error.message)
  else if (!!client.auth.user()) push('/')
}
</script>
