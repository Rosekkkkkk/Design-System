<template>
  <div class="orders-table-stack" :class="{ 'has-stats': hasSelectedOrders }">
    <OrderStatsCards v-if="hasSelectedOrders" :cards="statCards" />

    <div class="orders-table-body">
      <el-table :data="orders" :row-key="getAllOrderSummarySelectionKey" border height="100%" stripe @select="handleSelectionChange" @select-all="handleSelectionChange">
        <el-table-column type="selection" reserve-selection width="52" />
        <el-table-column align="center" label="序号" min-width="58" prop="index" />
        <el-table-column label="商家名称" min-width="120" prop="merchant" />
        <el-table-column label="订单数量" min-width="96" prop="orderCount" />
        <el-table-column label="照片张数" min-width="96" prop="photoCount" />
        <el-table-column label="接单总价" min-width="120" prop="receiveTotal" />
        <el-table-column label="派单总价" min-width="120" prop="dispatchTotal" />
        <el-table-column label="利润" min-width="120" prop="profit" />
        <el-table-column label="订单时间" min-width="360" prop="orderedAt" />
        <el-table-column label="操作" min-width="96" fixed="right">
          <template #default>
            <el-button class="summary-detail-button" link type="primary">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OrderStatsCards from './OrderStatsCards.vue'
import type { AllOrderSummary } from '../types/AllOrders'
import { createSummaryStatCards } from '../utils/allOrdersStats'
import { getAllOrderSummarySelectionKey } from '../utils/allOrdersSelection'

const props = defineProps<{
  orders: AllOrderSummary[]
  selectedOrders: AllOrderSummary[]
}>()

const hasSelectedOrders = computed(() => props.selectedOrders.length > 0)
const statCards = computed(() => createSummaryStatCards(props.selectedOrders))

const emit = defineEmits<{
  (event: 'selection-change', selection: AllOrderSummary[]): void
}>()

const handleSelectionChange = (selection: AllOrderSummary[]) => {
  emit('selection-change', selection)
}
</script>

<style scoped lang="scss">
.orders-table-stack {
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  &.has-stats {
    grid-template-rows: auto minmax(0, 1fr);
  }
}

.orders-table-body {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
</style>
