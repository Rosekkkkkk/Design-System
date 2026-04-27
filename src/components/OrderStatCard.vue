<template>
  <article class="order-stat-card" :style="cardStyle">
    <span class="order-stat-icon" aria-hidden="true">
      <component :is="statIcon" />
    </span>
    <span class="order-stat-content">
      <span class="order-stat-label">{{ label }}：</span>
      <strong class="order-stat-value">{{ value }}</strong>
    </span>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Coin, Money, Picture, Tickets, TrendCharts } from '@element-plus/icons-vue'

const iconMap = {
  Coin,
  Money,
  Picture,
  Tickets,
  TrendCharts,
}

const props = withDefaults(
  defineProps<{
    label: string
    value: string
    iconName?: string
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }>(),
  {
    backgroundColor: '#f8fbff',
    textColor: '#001b44',
    borderColor: '',
  }
)

const cardStyle = computed(() => ({
  '--stat-card-bg': props.backgroundColor,
  '--stat-card-color': props.textColor,
  '--stat-card-border': props.borderColor || props.textColor,
}))

const statIcon = computed(() => iconMap[props.iconName as keyof typeof iconMap] ?? Picture)
</script>

<style scoped lang="scss">
.order-stat-card {
  display: flex;
  flex: 0 1 var(--stat-card-width);
  align-items: center;
  justify-content: center;
  width: var(--stat-card-width);
  max-width: var(--stat-card-width);
  min-width: 0;
  height: 70px;
  padding: 0 14px;
  color: var(--stat-card-color);
  white-space: nowrap;
  background: var(--stat-card-bg);
  border: 1px solid var(--stat-card-border);
  border-radius: 6px;
  box-shadow: 0 6px 14px rgba(0, 15, 42, 0.06);
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 15, 42, 0.1);
    transform: translateY(-1px);
  }
}

.order-stat-icon {
  display: inline-flex;
  flex: 0 0 60px;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-right: 14px;
  color: var(--stat-card-color);

  :deep(svg) {
    width: 38px;
    height: 38px;
  }
}

.order-stat-content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.order-stat-label,
.order-stat-value {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-stat-label {
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.72;
}

.order-stat-value {
  margin-top: 7px;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}
</style>
