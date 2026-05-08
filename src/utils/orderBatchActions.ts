import type { AllOrder } from '../types/AllOrders'
import type { DesignerOrder } from '../types/DesignerOrders'

const isOrderStatusMatched = (status: string | undefined, statusCode: string | undefined, expectedStatus: string, expectedCode: string) => {
  return status === expectedStatus || statusCode === expectedCode
}

const canBatchOperate = <T>(rows: T[], predicate: (row: T) => boolean) => {
  return rows.length > 0 && rows.every(predicate)
}

export const canBatchCompleteDesignerOrders = (orders: DesignerOrder[]) => {
  return canBatchOperate(orders, (order) => isOrderStatusMatched(order.status, order.statusCode, '未完工', 'UNCOMPLETED'))
}

export const canBatchApproveOrders = (orders: AllOrder[]) => {
  return canBatchOperate(orders, (order) => isOrderStatusMatched(order.status, order.statusCode, '待审核', 'PENDING_REVIEW'))
}

export const canBatchDispatchOrders = (orders: AllOrder[]) => {
  return canBatchOperate(orders, (order) => isOrderStatusMatched(order.status, order.statusCode, '未派单', 'UNASSIGNED'))
}
