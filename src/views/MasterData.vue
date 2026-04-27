<template>
  <section class="master-data-view master-data-card">
    <header class="master-data-header">
      <h1>基础资料</h1>
      <el-button class="add-button" type="primary" :icon="Plus">{{ activeAddButtonText }}</el-button>
    </header>

    <main class="master-data-body">
      <el-tabs v-model="activeTab" class="master-tabs">
        <el-tab-pane label="商户管理" name="merchant" />
        <el-tab-pane label="照片类型" name="photoType" />
        <el-tab-pane label="客户信息" name="customer" />
      </el-tabs>

      <div class="table-panel">
        <el-table :data="activeRows" border height="100%">
          <el-table-column v-for="column in activeColumns" :key="column.prop" :label="column.label" :min-width="column.minWidth" :prop="column.prop" />
          <el-table-column fixed="right" label="操作" min-width="154">
            <template #default>
              <el-button class="edit-button" plain size="small" type="primary">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <footer class="pagination-panel">
        <el-pagination v-model:current-page="pagination.pageNo" v-model:page-size="pagination.pageSize" :pager-count="5" :total="96" layout="total, prev, pager, next, jumper" />
      </footer>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

type MasterTab = 'merchant' | 'photoType' | 'customer'

interface TableColumn {
  label: string
  prop: string
  minWidth: number
}

interface TableRow {
  [key: string]: string | number
}

const activeTab = ref<MasterTab>('merchant')

const pagination = reactive({
  pageNo: 1,
  pageSize: 16
})

const merchantColumns: TableColumn[] = [
  { label: '商户名称', prop: 'merchantName', minWidth: 430 },
  { label: '照片类型数量', prop: 'photoTypeCount', minWidth: 150 },
  { label: '客户数量', prop: 'customerCount', minWidth: 130 },
  { label: '默认接单价', prop: 'acceptPrice', minWidth: 140 },
  { label: '默认派单价', prop: 'dispatchPrice', minWidth: 140 },
  { label: '创建时间', prop: 'createdAt', minWidth: 430 }
]

const photoTypeColumns: TableColumn[] = [
  { label: '照片类型', prop: 'photoType', minWidth: 430 },
  { label: '默认接单价', prop: 'acceptPrice', minWidth: 150 },
  { label: '默认派单价', prop: 'dispatchPrice', minWidth: 150 },
  { label: '关联商户数量', prop: 'merchantCount', minWidth: 160 },
  { label: '创建时间', prop: 'createdAt', minWidth: 530 }
]

const customerColumns: TableColumn[] = [
  { label: '所属商户', prop: 'merchantName', minWidth: 260 },
  { label: '客户名称', prop: 'customerName', minWidth: 140 },
  { label: '默认张数', prop: 'defaultCount', minWidth: 120 },
  { label: '联系方式', prop: 'phone', minWidth: 150 },
  { label: '备注', prop: 'remark', minWidth: 370 },
  { label: '创建时间', prop: 'createdAt', minWidth: 380 }
]

const merchantNames = ['云帆摄影', '木石电商', '星野婚礼', '青橙影像', '森白视觉', '北岸写真', '拾光电商', '鹿鸣影像']
const photoTypeNames = ['精修', '抠图', '调色', '排版', '证件照', '产品修图']
const customerNames = ['李小姐', '张先生', '王女士', '赵先生', '刘女士', '何先生']
const customerRemarks = ['常规客户', '偏好自然风', '活动客户', '长期合作']

const merchantRows: TableRow[] = Array.from({ length: 16 }, (_, index) => {
  const suffix = index > 7 ? index : ''

  return {
    merchantName: `${merchantNames[index % merchantNames.length]}${suffix}`,
    photoTypeCount: (index % 5) + 2,
    customerCount: index + 8,
    acceptPrice: [12, 14, 16, 18][index % 4],
    dispatchPrice: [8, 9, 10][index % 3],
    createdAt: `2026-04-${String(index + 1).padStart(2, '0')} 10:20:00`
  }
})

const photoTypeRows: TableRow[] = Array.from({ length: 16 }, (_, index) => {
  const suffix = index > 5 ? index : ''

  return {
    photoType: `${photoTypeNames[index % photoTypeNames.length]}${suffix}`,
    acceptPrice: [12, 15, 18, 21, 24][index % 5],
    dispatchPrice: [8, 10, 12, 14, 16][index % 5],
    merchantCount: (index % 8) + 3,
    createdAt: `2026-04-${String(index + 1).padStart(2, '0')} 11:00:00`
  }
})

const customerRows: TableRow[] = Array.from({ length: 16 }, (_, index) => ({
  merchantName: merchantNames[index % merchantNames.length],
  customerName: customerNames[index % customerNames.length],
  defaultCount: index + 6,
  phone: `138****${String(2300 + index)}`,
  remark: customerRemarks[index % customerRemarks.length],
  createdAt: `2026-04-${String(index + 1).padStart(2, '0')} 14:00:00`
}))

const activeColumns = computed(() => {
  if (activeTab.value === 'photoType') return photoTypeColumns
  if (activeTab.value === 'customer') return customerColumns
  return merchantColumns
})

const activeRows = computed(() => {
  if (activeTab.value === 'photoType') return photoTypeRows
  if (activeTab.value === 'customer') return customerRows
  return merchantRows
})

const activeAddButtonText = computed(() => {
  if (activeTab.value === 'photoType') return '新增类型'
  if (activeTab.value === 'customer') return '新增客户'
  return '新增商户'
})
</script>

<style lang="scss">
.master-data-view.master-data-card {
  display: grid;
  grid-template-rows: 56px minmax(0, 1fr);
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  color: #001b44;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 18px 50px rgba(0, 15, 42, 0.18);
}

.master-data-view .master-data-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 0 30px;
  border-bottom: 1px solid #e8eef7;

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
  }
}

.master-data-view .add-button {
  width: 91px;
  height: 36px;
  padding: 0;
  font-weight: 800;
  border-radius: 8px;
}

.master-data-view .master-data-body {
  display: grid;
  grid-template-rows: 44px minmax(0, 1fr) 70px;
  overflow: hidden;
  min-height: 0;
  padding: 0 22px;
}

.master-data-view .master-tabs {
  min-height: 0;

  .el-tabs__header {
    height: 44px;
    margin: 0;
  }

  .el-tabs__nav-wrap {
    height: 44px;

    &::after {
      height: 1px;
      background: #dfe7f2;
    }
  }

  .el-tabs__nav-scroll {
    height: 44px;
  }

  .el-tabs__nav {
    height: 44px;
  }

  .el-tabs__item {
    height: 44px;
    padding: 0 26px 0 0;
    color: #001b44;
    font-size: 14px;
    font-weight: 500;
    line-height: 44px;

    &.is-active {
      color: #1f6bff;
      font-weight: 700;
    }
  }

  .el-tabs__active-bar {
    z-index: 2;
    height: 2px;
    background: #1f6bff;
    border-radius: 999px;
  }

  .el-tabs__content {
    display: none;
  }
}

.master-data-view .table-panel {
  min-height: 0;
  overflow: hidden;

  .el-table {
    --el-table-border-color: #dfe7f2;
    --el-table-header-bg-color: #f3f6fb;
    --el-table-row-hover-bg-color: #f8fbff;
    --el-table-tr-bg-color: #fff;
    --el-table-text-color: #001b44;
    --el-table-header-text-color: #001b44;
    font-size: 14px;
  }

  .el-table__header th {
    height: 41px;
    font-weight: 800;
  }

  .el-table__row td {
    height: 43px;
    font-weight: 500;
  }

  .el-table__cell {
    padding: 0;
  }
}

.master-data-view .edit-button {
  font-weight: 700;
}

.master-data-view .pagination-panel {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-pager {
    gap: 6px;
  }

  .el-pagination button,
  .el-pager li {
    min-width: 32px;
    height: 32px;
    border: 1px solid #d8e5f8;
    border-radius: 8px;
  }

  .el-pager li.is-active {
    color: #fff;
    background: #2563eb;
    border-color: #2563eb;
  }

  .el-pagination__jump {
    margin-left: 18px;
  }

  .el-pagination__editor.el-input {
    width: 48px;
  }
}

@media (max-width: 1200px) {
  .master-data-view .master-data-body {
    padding: 0 18px;
  }
}
</style>
