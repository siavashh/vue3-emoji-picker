<template>
  <div v-if="isInputType" class="v3-input-emoji-picker">
    <div class="v3-input-picker-root">
      <input
        v-if="type === 'input'"
        ref="elem"
        :value="input"
        type="text"
        class="v3-emoji-picker-input"
        @input="onChangeText"
        @blur="updateCursor"
      />
      <textarea
        v-else
        ref="elem"
        :value="input"
        class="v3-emoji-picker-textarea"
        @input="onChangeText"
        @blur="updateCursor"
      />
      <div
        class="v3-input-picker-wrap"
        :class="open ? 'v3-picker-is-open' : ''"
      >
        <button
          ref="button"
          type="button"
          class="v3-input-picker-icon"
          @click="open = !open"
        >
          <img :src="face" alt="" />
        </button>

        <div
          ref="picker"
          class="v3-emoji-picker"
          :class="'v3-color-theme-' + colorTheme + ' theme-' + theme"
        >
          <Header />
          <Body @select="onSelect" />
          <Footer />
        </div>
      </div>
    </div>
  </div>
  <div
    v-else-if="!isFullPage"
    class="v3-emoji-picker"
    :class="'v3-color-theme-' + colorTheme + ' theme-' + theme"
  >
    <Header />
    <Body @select="onSelect" />
    <Footer />
  </div>
  <div
    v-else
    class="v3-emoji-picker full-page-mode"
    :class="'container v3-color-theme-' + colorTheme + ' theme-' + theme"
  >
    <div class="row">
      <Sidebar />
      <Body @select="onSelect" />
    </div>
  </div>
</template>

<script lang="ts">
/**
 * External dependencies
 */
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  inject,
  computed,
  toRaw,
} from 'vue'
import { createPopper } from '@popperjs/core'

/**
 * Internal dependencies
 */
import smileys_people from '../svgs/groups/smileys_people.svg'
import Body from './Body.vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import Footer from './Footer.vue'
import { EmojiExt, Store } from '../types'

export default defineComponent({
  name: 'PickerRoot',
  components: {
    Header,
    Sidebar,
    Body,
    Footer,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    additionalGroups: {
      type: Object,
      default: () => ({}),
    },
    groupOrder: {
      type: Array,
      default: () => [],
    },
    groupIcons: {
      type: Object,
      default: () => ({}),
    },
    groupNames: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: {
    select: (emoji: EmojiExt) => true,
    'update:text': (value: string) => true,
  },
  setup(props, { emit }) {
    const elem = ref<HTMLInputElement>()
    const button = ref<HTMLButtonElement>()
    const picker = ref<any>()
    const open = ref(false)
    const input = ref(props.text)
    const isInputType = props.type === 'input' || props.type === 'textarea'
    const isFullPage = props.type == 'full-page'
    let cursor = -1
    const { state } = inject('store') as Store
    const colorTheme = computed(() => state.options.colorTheme)
    const theme = computed(() => state.options.theme)

    /**
     * Functions
     */
    function onSelect(emoji: EmojiExt) {
      if (isInputType) {
        const mode = state.options.mode
        if (mode === 'prepend') {
          input.value = emoji.i + input.value
        } else if (mode === 'insert' && cursor !== -1) {
          input.value = `${input.value.slice(0, cursor)}${
            emoji.i
          }${input.value.slice(cursor)}`
          cursor += emoji.i.length
        } else {
          input.value += emoji.i
        }
        emit('update:text', input.value)
      }

      emit('select', emoji)
    }

    function updateCursor() {
      if (elem.value) {
        cursor = elem.value?.selectionEnd || -1
      }
    }

    function clickListener(event: MouseEvent) {
      const isOutside = !(event.target as HTMLElement)?.closest(
        '.v3-input-picker-wrap'
      )
      if (isOutside && open.value) {
        open.value = false
      }
    }

    function setupPopper() {
      if (button.value && picker.value && isInputType) {
        let offset = state.options.offset

        if (typeof offset !== 'number') {
          offset = 6
        }

        createPopper(button.value, picker.value, {
          placement: 'bottom-end',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, offset],
              },
            },
          ],
        })

        document.body.addEventListener('click', clickListener)
      }
    }

    function onChangeText(event: any) {
      input.value = event.target.value || ''
      emit('update:text', input.value)
    }

    /**
     * Lifecycle
     */
    onMounted(() => {
      setupPopper()
    })

    // cleanup
    onBeforeUnmount(() => {
      document.body.removeEventListener('click', clickListener)
    })

    /**
     * Return vars
     */
    return {
      face: smileys_people,
      open,
      onSelect,
      input,
      elem,
      updateCursor,
      button,
      picker,
      isInputType,
      isFullPage,
      onChangeText,
      colorTheme,
      theme,
    }
  },
})
</script>
