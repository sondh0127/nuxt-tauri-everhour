<script lang="ts" setup>
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { toRefs } from 'vue';

const props = defineProps<{ error: any, isPending: any, isError: any }>()
const { error, isPending, isError } = toRefs(props)
</script>

<template>
  <span v-if="isPending">Loading...</span>
  <span v-else-if="isError">Error: {{ error?.message }}</span>
  <slot v-else />
</template>
