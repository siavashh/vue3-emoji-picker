<template>
  <div class="v3-search">
    <input
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      :class="{ 'form-control mb-3': theme == 'bootstrap' }"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { Store } from '../types'
export default defineComponent({
  name: 'Search',

  setup(props) {
    const { state, updateSearch } = inject('store') as Store
    const hasSearch = computed(() => !state.options.hideSearch)
    const searchValue = computed({
      get: () => state.search,
      set: (value: string) => updateSearch(value),
    })
    const placeholder = computed(
      () => state.options.staticTexts.placeholder || ''
    )
    const theme = computed(() => state.options.theme)

    return {
      hasSearch,
      searchValue,
      placeholder,
      theme,
    }
  },
})
</script>
