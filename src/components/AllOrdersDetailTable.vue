<template>
  <div class="orders-table-body">
    <div class="orders-table-scroll-region">
      <el-table ref="tableRef" :data="orders" :row-key="getAllOrderSelectionKey" border height="100%" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" reserve-selection width="52" />
      <el-table-column align="center" label="序号" min-width="58" prop="index" />
      <el-table-column min-width="120" prop="merchant">
        <template #header>
          <button class="table-header-link" type="button" @click="merchantDialogVisible = true">商家名称</button>
        </template>
      </el-table-column>
      <el-table-column label="照片类型" min-width="91" prop="photoType" />
      <el-table-column label="状态" min-width="90">
        <template #default="{ row }">
          <el-tag class="order-status-tag" :class="getStatusTagConfig(row.status).className" :type="getStatusTagConfig(row.status).type" effect="light" round>
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="80" prop="designer">
        <template #header>
          <button class="table-header-link" type="button" @click="designerDialogVisible = true">设计师</button>
        </template>
      </el-table-column>
      <el-table-column label="订单号" min-width="150" prop="orderNo" />
      <el-table-column label="照片张数" min-width="81" prop="photoCount" />
      <el-table-column label="接单价" min-width="90" prop="receivePrice" />
      <el-table-column label="接单合计" min-width="82" prop="receiveTotal" />
      <el-table-column label="派单价" min-width="90" prop="dispatchPrice" />
      <el-table-column label="派单合计" min-width="82" prop="dispatchTotal" />
      <el-table-column label="客户信息" min-width="91" prop="customer" />
      <el-table-column label="下单时间" width="170" prop="orderedAt" />
      <el-table-column label="完工时间" width="170" prop="completedAt" />
      <el-table-column label="备注" width="220" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" width="262" fixed="right">
        <template #default="{ row }">
          <div class="order-actions">
            <el-button v-for="action in getOrderActions(row.status)" :key="action.label" plain size="small" :type="action.type" @click="handleOrderAction(action.key, row)">
              {{ action.label }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <div class="selection-summary-bar" :class="{ 'is-visible': hasSelectedOrders }">
      <span class="selection-summary-check" aria-hidden="true">✓</span>
      <span class="selection-summary-count">{{ selectedCountText }}</span>
      <span class="selection-summary-metric">照片张数 <strong>{{ formatOrderStatNumber(selectedStatValues.photoCount) }}</strong></span>
      <span class="selection-summary-metric">接单合计 <strong>¥{{ formatOrderStatNumber(selectedStatValues.receiveTotal) }}</strong></span>
      <span class="selection-summary-metric">派单合计 <strong>¥{{ formatOrderStatNumber(selectedStatValues.dispatchTotal) }}</strong></span>
      <el-button class="clear-selection-button" plain size="small" @click="clearSelection">清空选择</el-button>
    </div>

    <el-dialog v-model="merchantDialogVisible" title="商家明细" class="orders-group-dialog" width="1180px">
      <el-collapse v-model="activeMerchantGroups">
        <el-collapse-item v-for="group in merchantOrderGroups" :key="group.name" :name="group.name">
          <template #title>
            <span class="collapse-title">{{ group.name }}</span>
            <span class="collapse-count">{{ group.orders.length }} 单</span>
          </template>

          <el-table :data="group.orders" border stripe>
            <el-table-column label="设计师" min-width="90" prop="designer" />
            <el-table-column label="客户信息" min-width="110" prop="customer" />
            <el-table-column label="照片张数" min-width="90" prop="photoCount" />
            <el-table-column label="接单价" min-width="90" prop="receivePrice" />
            <el-table-column label="派单价" min-width="90" prop="dispatchPrice" />
            <el-table-column label="订单号" min-width="150" prop="orderNo" />
            <el-table-column label="下单时间" min-width="180" prop="orderedAt" />
            <el-table-column label="备注" min-width="180" prop="remark" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>

    <el-dialog v-model="designerDialogVisible" title="设计人明细" class="orders-group-dialog" width="1180px">
      <el-collapse v-model="activeDesignerGroups">
        <el-collapse-item v-for="group in designerOrderGroups" :key="group.name" :name="group.name">
          <template #title>
            <span class="collapse-title">{{ group.name }}</span>
            <span class="collapse-count">{{ group.orders.length }} 单</span>
          </template>

          <el-table :data="group.orders" border stripe>
            <el-table-column label="商家名称" min-width="120" prop="merchant" />
            <el-table-column label="设计人" min-width="90" prop="designer" />
            <el-table-column label="照片类型" min-width="90" prop="photoType" />
            <el-table-column label="状态" min-width="90" prop="status" />
            <el-table-column label="下单时间" min-width="180" prop="orderedAt" />
            <el-table-column label="接单价" min-width="90" prop="receivePrice" />
            <el-table-column label="派单价" min-width="90" prop="dispatchPrice" />
            <el-table-column label="照片张数" min-width="90" prop="photoCount" />
            <el-table-column label="备注" min-width="180" prop="remark" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableInstance } from 'element-plus'
import type { AllOrder } from '../types/AllOrders'
import { getAllOrderSelectionKey } from '../utils/allOrdersSelection'
import { createDetailStatValues, formatOrderStatNumber } from '../utils/allOrdersStats'

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

type OrderActionKey = 'dispatch' | 'approve' | 'reject' | 'edit' | 'delete'
type OrderActionType = 'primary' | 'success' | 'warning' | 'danger'

interface OrderAction {
  key: OrderActionKey
  label: string
  type: OrderActionType
}

interface OrderGroup {
  name: string
  orders: AllOrder[]
}

const props = defineProps<{
  orders: AllOrder[]
  groupOrders?: AllOrder[]
  selectedOrders: AllOrder[]
}>()

const tableRef = ref<TableInstance>()
const merchantDialogVisible = ref(false)
const designerDialogVisible = ref(false)
const activeMerchantGroups = ref<string[]>([])
const activeDesignerGroups = ref<string[]>([])
const hasSelectedOrders = computed(() => props.selectedOrders.length > 0)
const selectedStatValues = computed(() => createDetailStatValues(props.selectedOrders))
const selectedCountText = computed(() => `已选 ${formatOrderStatNumber(props.selectedOrders.length)} 条`)

const groupOrdersByField = (field: 'merchant' | 'designer'): OrderGroup[] => {
  const groupMap = new Map<string, AllOrder[]>()
  const orderSource = props.groupOrders ?? props.orders

  orderSource.forEach((order) => {
    const groupName = order[field] || '未填写'
    groupMap.set(groupName, [...(groupMap.get(groupName) ?? []), order])
  })

  return Array.from(groupMap, ([name, groupedOrders]) => ({ name, orders: groupedOrders }))
}

const merchantOrderGroups = computed(() => groupOrdersByField('merchant'))
const designerOrderGroups = computed(() => groupOrdersByField('designer'))

const emit = defineEmits<{
  (event: 'selection-change', selection: AllOrder[]): void
  (event: 'edit-order', order: AllOrder): void
  (event: 'clear-selection'): void
}>()

const editAction: OrderAction = {
  key: 'edit',
  label: '编辑',
  type: 'primary',
}

const deleteAction: OrderAction = {
  key: 'delete',
  label: '删除',
  type: 'danger',
}

const defaultActions: OrderAction[] = [editAction, deleteAction]

const actionMap: Record<string, OrderAction[]> = {
  未派单: [
    {
      key: 'dispatch',
      label: '派单',
      type: 'success',
    },
    editAction,
    deleteAction,
  ],
  未完工: defaultActions,
  待审核: [
    {
      key: 'approve',
      label: '通过',
      type: 'warning',
    },
    {
      key: 'reject',
      label: '退回',
      type: 'danger',
    },
    editAction,
    deleteAction,
  ],
  已完工: defaultActions,
  问题件: defaultActions,
  其他: defaultActions,
}

const getOrderActions = (status: string) => actionMap[status] ?? defaultActions

const handleOrderAction = (action: OrderActionKey, order: AllOrder) => {
  if (action === 'edit') {
    emit('edit-order', order)
  }
}

const handleSelectionChange = (selection: AllOrder[]) => {
  emit('selection-change', selection)
}

const clearSelection = () => {
  tableRef.value?.clearSelection()
  emit('clear-selection')
}
</script>

<style scoped lang="scss">
.orders-table-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.orders-table-scroll-region {
  flex: 1 1 auto;
  min-height: 0;
  transition: min-height 0.26s ease;
}

.selection-summary-bar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 26px;
  height: 0;
  max-height: 0;
  margin-top: 0;
  padding: 0 18px;
  overflow: hidden;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 8px;
  opacity: 0;
  transform: translateY(8px);
  background: linear-gradient(135deg, #078f86 0%, #007f7a 52%, #00746f 100%);
  box-shadow: 0 12px 26px rgba(0, 114, 108, 0);
  transition:
    height 0.26s ease,
    max-height 0.26s ease,
    margin 0.26s ease,
    padding 0.26s ease,
    border-color 0.26s ease,
    opacity 0.22s ease,
    transform 0.26s ease,
    box-shadow 0.26s ease;

  &.is-visible {
    height: 40px;
    max-height: 40px;
    margin-top: 10px;
    border-color: rgba(255, 255, 255, 0.18);
    opacity: 1;
    transform: translateY(0);
    box-shadow: 0 12px 26px rgba(0, 114, 108, 0.18);
  }
}

.selection-summary-check {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  color: #008b83;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  background: #dff8f4;
  border-radius: 50%;
}

.selection-summary-count,
.selection-summary-metric {
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.92);
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.selection-summary-count {
  margin-left: -16px;
}

.selection-summary-metric strong {
  margin-left: 6px;
  color: #fff;
  font-size: 15px;
  font-weight: 900;
}

.clear-selection-button {
  width: 78px;
  height: 28px;
  padding: 0;
  margin-left: auto;
  color: #e9fffb;
  font-size: 13px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.58);
  border-radius: 4px;

  &:hover,
  &:focus {
    color: #fff;
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.82);
  }
}

.order-actions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.table-header-link {
  padding: 0;
  color: #0057ff;
  font: inherit;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  background: transparent;
  border: 0;

  &:hover,
  &:focus-visible {
    color: #003fbd;
    text-decoration: underline;
  }
}

.collapse-title {
  color: #001b44;
  font-size: 15px;
  font-weight: 800;
}

.collapse-count {
  margin-left: 10px;
  color: #6b7f9d;
  font-size: 13px;
  font-weight: 700;
}

:deep(.orders-group-dialog) {
  --el-dialog-padding-primary: 0;
  border-radius: 14px;
  overflow: hidden;
}

:deep(.orders-group-dialog .el-dialog__header) {
  padding: 20px 28px 14px;
  margin-right: 42px;
  border-bottom: 1px solid #e8eef7;
}

:deep(.orders-group-dialog .el-dialog__title) {
  color: #001b44;
  font-size: 18px;
  font-weight: 800;
}

:deep(.orders-group-dialog .el-dialog__body) {
  max-height: 72vh;
  padding: 16px 22px 24px;
  overflow: auto;
  background: #f8fbff;
}

:deep(.orders-group-dialog .el-collapse) {
  border-top: 0;
}

:deep(.orders-group-dialog .el-collapse-item) {
  margin-bottom: 12px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #dfe7f2;
  border-radius: 12px;
}

:deep(.orders-group-dialog .el-collapse-item__header) {
  height: 46px;
  padding: 0 16px;
  border-bottom-color: #edf2f8;
}

:deep(.orders-group-dialog .el-collapse-item__wrap) {
  border-bottom: 0;
}

:deep(.orders-group-dialog .el-collapse-item__content) {
  padding: 14px 16px 16px;
}

:deep(.orders-group-dialog .el-table) {
  --el-table-border-color: #dfe7f2;
  --el-table-header-bg-color: #f3f6fb;
  --el-table-header-text-color: #001b44;
  --el-table-text-color: #001b44;
  font-size: 13px;
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
