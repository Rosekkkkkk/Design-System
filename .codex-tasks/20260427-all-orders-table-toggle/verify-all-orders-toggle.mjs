import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..', '..')
const allOrdersPath = resolve(root, 'src/views/AllOrders.vue')
const detailPath = resolve(root, 'src/components/AllOrdersDetailTable.vue')
const summaryPath = resolve(root, 'src/components/AllOrdersSummaryTable.vue')
const typesPath = resolve(root, 'src/types/AllOrders.ts')

const read = (path) => readFileSync(path, 'utf8')
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

assert(existsSync(detailPath), '缺少详情表格组件')
assert(existsSync(summaryPath), '缺少汇总表格组件')

const allOrders = read(allOrdersPath)
const detail = read(detailPath)
const summary = read(summaryPath)
const types = read(typesPath)

assert(allOrders.includes("tableMode") && allOrders.includes("toggleTableMode"), 'AllOrders 未接入表格模式切换')
assert(allOrders.includes("filters.keyword = ''"), '切换表格时未重置搜索词')
assert(allOrders.includes('selectedRows.value = []'), '切换表格时未重置选中项')
assert(allOrders.includes('pagination.pageNo = 1'), '切换表格时未重置页码')
assert(allOrders.includes('AllOrdersDetailTable') && allOrders.includes('AllOrdersSummaryTable'), 'AllOrders 未引用两个表格组件')
assert(detail.includes('照片类型') && detail.includes('编辑'), '详情表格未保留当前列')
assert(summary.includes('订单数量') && summary.includes('利润') && summary.includes('订单时间'), '汇总表格未包含原型列')
assert(types.includes('AllOrderSummary'), '缺少汇总表格类型')

console.log('AllOrders table toggle verification passed')
