<template>
  <div class="v3-sidebar col-sm-12 col-md-3">
    <div class="v3-hovered-icon">
      <span :class="platform" class="v3-icon">
        <span v-if="native || hasError">{{ unicodeToEmoji(emoji.r) }}</span>
        <img
          v-else
          :alt="unicodeToEmoji(emoji.r)"
          :src="emoji.src"
          @error="hasError = true"
        />
      </span>
      <span class="v3-text">
        :{{ emoji[EMOJI_NAME_KEY][1] || emoji[EMOJI_NAME_KEY][0] }}:
      </span>
    </div>
    <div v-if="hasGroupIcons" class="v3-header v3-sidebar-header">
      <template v-if="hasGroupIcons">
        <div class="v3-sidebar-title">Category</div>
        <div v-if="hasGroupIcons" class="v3-groups v3-groups-vertical">
          <button
            v-for="group of orderedGroups"
            :key="group.key"
            type="button"
            class="v3-group"
            :class="{
              'v3-is-hidden': !icons[group.key],
              selected:
                group.key == currentActiveGroup ||
                (group.key == 'recent' && currentActiveGroup == ''),
            }"
            @click="updateActiveGroup(group.key)"
          >
            <span :title="group.title" class="v3-icon">
              <img :src="icons[group.key]" alt="" />
              <span class="v3-category-title ms-2">{{ group.title }}</span>
            </span>
          </button>
        </div>
      </template>
    </div>
    <div
      class="v3-footer v3-sidebar-footer"
      @mouseleave="updateSkinToneState(false)"
    >
      <template v-if="hasSkinTones">
        <div class="v3-sidebar-title">Skin Tone</div>
        <div
          class="v3-skin-tones v3-is-open v3-skin-tones-vertical v3-groups v3-groups-vertical"
        >
          <button
            v-for="tone in SKIN_TONES"
            :key="tone"
            type="button"
            :title="tone"
            class="v3-group"
            :class="{ selected: tone == stateSkinTone }"
            @click="selectSkinTone(tone)"
          >
            <i :class="['v3-skin-tone-' + tone, 'v3-skin-tone']" />
            <span class="v3-icon-title ms-2">
              {{ skinToneName(tone) }}
            </span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * External dependencies
 */
import { computed, defineComponent, inject, ref, watch } from 'vue'

/**
 * Internal dependencies
 */
import {
  EMOJI_REMOTE_SRC,
  SKIN_TONES,
  EMOJI_RESULT_KEY,
  EMOJI_NAME_KEY,
} from '../constant'
/**
 * Internal dependencies
 */
import { Group, Store } from '../types'
import { snakeToCapitalizedCase, unicodeToEmoji, isMac } from '../helpers'

/**
 * Group/Category Images
 */
import smileys_people from '../svgs/groups/smileys_people.svg'
import animals_nature from '../svgs/groups/animals_nature.svg'
import food_drink from '../svgs/groups/food_drink.svg'
import activities from '../svgs/groups/activities.svg'
import travel_places from '../svgs/groups/travel_places.svg'
import objects from '../svgs/groups/objects.svg'
import symbols from '../svgs/groups/symbols.svg'
import flags from '../svgs/groups/flags.svg'
import recent from '../svgs/groups/recent.svg'
export default defineComponent({
  name: 'Sidebar',
  setup(props) {
    const { state, updateActiveGroup, updateSkinTone } = inject(
      'store'
    ) as Store
    const skinTone = ref(false)
    const hasError = ref(false)
    const stateSkinTone = computed(() => state.skinTone)

    const skinToneText = computed(
      () => state.options.staticTexts.skinTone || 'Skin tone'
    )
    const hasSkinTones = computed(() => !state.options.disableSkinTones)
    const platform = isMac() ? 'is-mac' : ''

    const emoji = computed<any>(() => {
      return {
        ...state.emoji,
        src: EMOJI_REMOTE_SRC + '/' + state.emoji[EMOJI_RESULT_KEY] + '.png',
      }
    })
    const currentActiveGroup = computed(() => {
      return state.activeGroup
    })
    function updateSkinToneState(open = true) {
      skinTone.value = open
    }

    function toggleSkinToneState() {
      skinTone.value = !skinTone.value
    }

    function selectSkinTone(tone: string) {
      updateSkinTone(tone)
      updateSkinToneState(false)
    }
    function skinToneName(tone: string) {
      return tone == 'neutral'
        ? 'Neutral'
        : tone == '1f3fb'
        ? 'Light'
        : tone == '1f3fc'
        ? 'Medium-Light'
        : tone == '1f3fd'
        ? 'Medium'
        : tone == '1f3fe'
        ? 'Medium-Dark'
        : tone == '1f3ff'
        ? 'Dark'
        : 'Neutral'
    }
    const hasGroupIcons = computed(() => !state.options.hideGroupIcons)
    const orderedKeys = JSON.parse(JSON.stringify(state.orderedGroupKeys))
    const placeholder = computed(
      () => state.options.staticTexts.placeholder || ''
    )
    const pickerType = computed(() => state.options.pickerType)
    const groups: Group[] = [
      ...state.groups,
      ...Object.keys(state.options.additionalGroups).map((g) => ({
        key: g,
        title: state.options.groupNames[g]
          ? state.options.groupNames[g]
          : snakeToCapitalizedCase(g),
      })),
    ] as Group[]

    const orderedGroups: Group[] = []

    orderedKeys.forEach((key: string) => {
      const index = groups.findIndex((group) => group.key === key)
      if (index === -1) return
      orderedGroups.push(groups[index])
      groups.splice(index, 1)
    })

    watch(
      () => state.emoji,
      () => {
        hasError.value = false
      }
    )

    return {
      orderedGroups,
      orderedKeys,
      updateActiveGroup,
      hasGroupIcons,
      placeholder,
      icons: {
        smileys_people,
        animals_nature,
        food_drink,
        activities,
        travel_places,
        objects,
        symbols,
        flags,
        ...state.options.groupIcons,
        recent,
      } as Record<string, string>,
      emoji,
      SKIN_TONES,
      updateSkinToneState,
      skinTone,
      stateSkinTone,
      skinToneName,
      selectSkinTone,
      toggleSkinToneState,
      EMOJI_RESULT_KEY,
      EMOJI_NAME_KEY,
      skinToneText,
      hasSkinTones,
      native: state.options.native,
      unicodeToEmoji,
      platform,
      hasError,
      pickerType,
      currentActiveGroup,
    }
  },
})
</script>
