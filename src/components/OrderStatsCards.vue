<template>
  <div class="order-stats-row" :style="rowStyle">
    <OrderStatCard
      v-for="card in cards"
      :key="card.label"
      :background-color="card.backgroundColor ?? defaultBackgroundColor"
      :border-color="card.borderColor ?? defaultBorderColor"
      :icon-name="card.iconName"
      :label="card.label"
      :text-color="card.textColor ?? defaultTextColor"
      :value="card.value"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OrderStatCard from './OrderStatCard.vue'
import type { OrderStatCardItem } from '../utils/allOrdersStats'

const props = withDefaults(
  defineProps<{
    cards: OrderStatCardItem[]
    defaultBackgroundColor?: string
    defaultTextColor?: string
    defaultBorderColor?: string
  }>(),
  {
    defaultBackgroundColor: '#f8fbff',
    defaultTextColor: '#001b44',
    defaultBorderColor: '#dfe8f4',
  }
)

const rowStyle = computed(() => ({
  '--stat-card-count': String(Math.max(props.cards.length, 1)),
  '--stat-card-total-gap': `${Math.max(props.cards.length - 1, 0) * 18}px`,
  '--stat-card-width': 'calc((100% - (4 * var(--stat-card-gap))) / 5)',
}))
</script>

<style scoped lang="scss">
.order-stats-row {
  --stat-card-gap: 18px;
  box-sizing: border-box;
  container-type: inline-size;
  display: flex;
  flex-wrap: nowrap;
  gap: var(--stat-card-gap);
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 14px 0;
  overflow: hidden;
}
</style>
