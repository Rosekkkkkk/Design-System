<template>
  <div class="orders-table-stack" :class="{ 'has-stats': hasSelectedOrders }">
    <OrderStatsCards v-if="hasSelectedOrders" :cards="statCards" />

    <div class="orders-table-body">
      <el-table :data="orders" :row-key="getAllOrderSelectionKey" border height="100%" stripe @select="handleSelectionChange" @select-all="handleSelectionChange">
        <el-table-column type="selection" reserve-selection width="52" />
        <el-table-column align="center" label="序号" min-width="58" prop="index" />
        <el-table-column label="商家名称" min-width="120" prop="merchant" />
        <el-table-column label="照片类型" min-width="91" prop="photoType" />
        <el-table-column label="状态" min-width="90">
          <template #default="{ row }">
            <el-tag class="order-status-tag" :class="getStatusTagConfig(row.status).className" :type="getStatusTagConfig(row.status).type" effect="light" round>
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="设计师" min-width="80" prop="designer" />
        <el-table-column label="订单号" min-width="150" prop="orderNo" />
        <el-table-column label="照片张数" min-width="81" prop="photoCount" />
        <el-table-column label="接单价" min-width="90" prop="receivePrice" />
        <el-table-column label="接单合计" min-width="82" prop="receiveTotal" />
        <el-table-column label="派单价" min-width="90" prop="dispatchPrice" />
        <el-table-column label="派单合计" min-width="82" prop="dispatchTotal" />
        <el-table-column label="客户信息" min-width="91" prop="customer" />
        <el-table-column label="备注" min-width="300">
          <template #default="{ row }">
            <span class="remark-text">{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" min-width="200" prop="orderedAt" />
        <el-table-column label="操作" min-width="164" fixed="right">
          <template #default="{ row }">
            <el-button plain size="small" type="primary">详情</el-button>
            <el-button plain size="small" type="primary" @click="emit('edit-order', row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OrderStatsCards from './OrderStatsCards.vue'
import type { AllOrder } from '../types/AllOrders'
import { createDetailStatCards } from '../utils/allOrdersStats'
import { getAllOrderSelectionKey } from '../utils/allOrdersSelection'

type StatusTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

interface StatusTagConfig {
  type: StatusTagType
  className: string
}

const statusTagConfigMap: Record<string, StatusTagConfig> = {
  未派单: {
    type: 'info',
    className: 'is-unassigned'
  },
  未完工: {
    type: 'primary',
    className: 'is-uncompleted'
  },
  待审核: {
    type: 'warning',
    className: 'is-pending-review'
  },
  已完工: {
    type: 'success',
    className: 'is-completed'
  },
  问题件: {
    type: 'danger',
    className: 'is-problem'
  },
  其他: {
    type: 'info',
    className: 'is-other'
  }
}

const getStatusTagConfig = (status: string) => statusTagConfigMap[status] ?? statusTagConfigMap['其他']

const props = defineProps<{
  orders: AllOrder[]
  selectedOrders: AllOrder[]
}>()

const hasSelectedOrders = computed(() => props.selectedOrders.length > 0)
const statCards = computed(() => createDetailStatCards(props.selectedOrders))

const emit = defineEmits<{
  (event: 'selection-change', selection: AllOrder[]): void
  (event: 'edit-order', order: AllOrder): void
}>()

const handleSelectionChange = (selection: AllOrder[]) => {
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

.order-status-tag {
  min-width: 58px;
  justify-content: center;
  border-color: var(--status-tag-border-color);
  color: var(--status-tag-text-color);
  background: var(--status-tag-bg-color);
  font-weight: 700;

  &.is-unassigned {
    --status-tag-text-color: #475569;
    --status-tag-bg-color: #f1f5f9;
    --status-tag-border-color: #cbd5e1;
  }

  &.is-uncompleted {
    --status-tag-text-color: #1d4ed8;
    --status-tag-bg-color: #eff6ff;
    --status-tag-border-color: #bfdbfe;
  }

  &.is-pending-review {
    --status-tag-text-color: #b45309;
    --status-tag-bg-color: #fffbeb;
    --status-tag-border-color: #fde68a;
  }

  &.is-completed {
    --status-tag-text-color: #15803d;
    --status-tag-bg-color: #f0fdf4;
    --status-tag-border-color: #bbf7d0;
  }

  &.is-problem {
    --status-tag-text-color: #b91c1c;
    --status-tag-bg-color: #fef2f2;
    --status-tag-border-color: #fecaca;
  }

  &.is-other {
    --status-tag-text-color: #4b5563;
    --status-tag-bg-color: #f9fafb;
    --status-tag-border-color: #d1d5db;
  }
}
</style>
