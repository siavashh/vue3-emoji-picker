<template>
  <h2>Default</h2>
  <picker
    :native="false"
    :display-recent="true"
    picker-type="full-page"
    theme="bootstrap"
    @select="onSelect"
  />
</template>

<script lang="ts">
/**
 * External dependencies
 */
import { defineComponent, ref } from 'vue'

/**
 * Internal dependencies
 */
import Picker from './components/Picker.vue'

/**
 * SVGs
 */
import custom from './svgs/groups/custom.svg'

export default defineComponent({
  name: 'App',
  components: {
    Picker,
  },
  setup() {
    const text = ref('input')

    /**
     * Handle text change
     * @param new_text
     */
    function onChangeText(new_text: string | undefined) {
      text.value = new_text || ''
    }

    function onSelect(emoji: any) {
      alert(`${emoji.i} selected, check console log for emoji details.`)
      console.log(emoji)
    }

    const additionalGroups = {
      my_custom_group: [
        { n: ['grinning face', 'grinning'], u: '1f600' },
        { n: ['grinning face with smiling eyes', 'grin'], u: '1f601' },
      ],
    }

    /**
     * Return vars
     */
    return {
      onChangeText,
      text,
      onSelect,
      additionalGroups,
      custom,
    }
  },
})
</script>

<style lang="scss">
h2 {
  margin-top: 60px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto 0;
}
.input-wrap {
  input {
    display: block;
    height: 40px;
    width: 400px;
    margin: 0 auto 30px;
    padding: 0 20px;
  }
}
</style>
