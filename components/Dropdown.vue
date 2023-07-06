<template>
  <div class="relative inline-block text-left">
    <div>
      <button
        type="button"
        class="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-gray-700 border-gray-800 placeholder-gray-400 text-white px-2 py-[6px] text-sm shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600"
        id="menu-button"
        :aria-expanded="openPopup ? 'true' : 'false'"
        :aria-haspopup="openPopup ? 'true' : 'false'"
        @click="openPopup = !openPopup"
      >
        <template v-if="!vModel">
          {{ placeholder }}
        </template>
        <template v-else>
          <slot name="selected" :value="vModel" :item="itemSelected">
            {{ itemSelected?.text }}
          </slot>
        </template>
        <svg
          class="-mr-1 h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <Transition name="dropdown">
      <div
        v-if="openPopup"
        class="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        :aria-orientation="orientation"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div
          v-if="!items.length"
          class="text-gray-400 block px-4 py-2 text-sm text-center"
        >
          No Options
        </div>
        <div
          v-else
          class="py-1"
          role="none"
          :class="{
            'flex flex-row p-1.5 gap-1.5': orientation === 'horizontal',
          }"
        >
          <div
            v-for="(item, index) in items"
            :key="`item-${item.value}`"
            :id="`menu-item-${index}`"
            class="text-gray-200 block px-4 py-2 text-sm hover:bg-gray-600 cursor-pointer"
            :class="{
              'bg-gray-600': item.value === vModel,
              rounded: orientation === 'horizontal',
            }"
            role="menuitem"
            tabindex="-1"
            @click="handleChoose(item.value)"
          >
            <slot name="item" :item="item">{{ item.text }}</slot>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
  items: {
    type: Array as PropType<{ text: string; value: any }[]>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Select",
  },
  orientation: {
    type: String as PropType<"vertical" | "horizontal">,
    default: "vertical",
  },
});
const emits = defineEmits(["update:modelValue"]);
const vModel = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emits("update:modelValue", newValue);
  },
});
const openPopup = ref(false);
const itemSelected = computed(
  () => props.items.find((item) => item.value === vModel.value) || undefined
);

function handleChoose(newValue: any) {
  vModel.value = newValue;
  openPopup.value = false;
}
</script>

<style scoped lang="scss">
.dropdown-enter-active {
  @apply transition ease-out duration-100;
}
.dropdown-leave-active {
  @apply transition ease-in duration-75;
}

.dropdown-enter-from {
  @apply transform opacity-0 scale-95;
}
.dropdown-enter-to {
  @apply transform opacity-100 scale-100;
}
.dropdown-leave-from {
  @apply transform opacity-100 scale-100;
}
.dropdown-leave-to {
  @apply transform opacity-0 scale-95;
}
</style>
