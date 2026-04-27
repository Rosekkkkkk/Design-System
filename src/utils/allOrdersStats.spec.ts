import type { AllOrder, AllOrderSummary } from '../types/AllOrders'
import { createDetailStatCards, createSummaryStatCards } from './allOrdersStats'

const detailOrders: AllOrder[] = [
  {
    index: 1,
    merchant: '云帆摄影',
    photoType: '精修',
    status: '已完工',
    designer: '林设计',
    orderNo: 'DD20260427001',
    photoCount: 3,
    receivePrice: 12,
    receiveTotal: 36,
    dispatchPrice: 8,
    dispatchTotal: 24,
    customer: '李小姐',
    remark: '',
    orderedAt: '2026-04-27 10:00:00',
  },
]

const summaryOrders: AllOrderSummary[] = [
  {
    index: 1,
    merchant: '云帆摄影',
    orderCount: 2,
    photoCount: 9,
    receiveTotal: 120,
    dispatchTotal: 80,
    profit: 40,
    orderedAt: '2026-04-27 00:00:00',
  },
]

const detailStats = createDetailStatCards(detailOrders)
const summaryStats = createSummaryStatCards(summaryOrders)

detailStats satisfies Array<{ label: string; value: string; backgroundColor?: string; textColor?: string }>
summaryStats satisfies Array<{ label: string; value: string; backgroundColor?: string; textColor?: string }>

const detailLabels: ['照片总张数', '接单总价', '派单总价'] = detailStats.map((item) => item.label) as [
  '照片总张数',
  '接单总价',
  '派单总价',
]
const summaryLabels: ['订单总数', '照片总张数', '接单总价', '派单总价', '利润'] = summaryStats.map((item) => item.label) as [
  '订单总数',
  '照片总张数',
  '接单总价',
  '派单总价',
  '利润',
]

void detailLabels
void summaryLabels
