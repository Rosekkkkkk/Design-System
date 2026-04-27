import type { AllOrder, AllOrderSummary } from '../types/AllOrders'

export interface OrderStatCardItem {
  label: string
  value: string
  iconName?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
}

const cardThemeMap: Record<string, Pick<OrderStatCardItem, 'iconName' | 'backgroundColor' | 'textColor' | 'borderColor'>> = {
  订单总数: {
    iconName: 'Tickets',
    backgroundColor: '#eef6ff',
    textColor: '#1554b7',
    borderColor: '#bfdbfe',
  },
  照片总张数: {
    iconName: 'Picture',
    backgroundColor: '#ecfeff',
    textColor: '#0e7490',
    borderColor: '#a5f3fc',
  },
  接单总价: {
    iconName: 'Money',
    backgroundColor: '#fff7ed',
    textColor: '#c2410c',
    borderColor: '#fed7aa',
  },
  派单总价: {
    iconName: 'Coin',
    backgroundColor: '#f5f3ff',
    textColor: '#6d28d9',
    borderColor: '#ddd6fe',
  },
  利润: {
    iconName: 'TrendCharts',
    backgroundColor: '#f0fdf4',
    textColor: '#15803d',
    borderColor: '#bbf7d0',
  },
}

const defaultCardColors = {
  backgroundColor: '#f8fbff',
  textColor: '#001b44',
  borderColor: '#dfe8f4',
}

const sumBy = <T>(items: T[], selector: (item: T) => number) => items.reduce((total, item) => total + selector(item), 0)

const formatNumber = (value: number) => new Intl.NumberFormat('zh-CN').format(value)

const createCard = (label: string, value: number): OrderStatCardItem => ({
  label,
  value: formatNumber(value),
  ...(cardThemeMap[label] ?? defaultCardColors),
})

export const createDetailStatCards = (orders: AllOrder[]): OrderStatCardItem[] => [
  createCard('照片总张数', sumBy(orders, (order) => order.photoCount)),
  createCard('接单总价', sumBy(orders, (order) => order.receiveTotal)),
  createCard('派单总价', sumBy(orders, (order) => order.dispatchTotal)),
]

export const createSummaryStatCards = (orders: AllOrderSummary[]): OrderStatCardItem[] => [
  createCard('订单总数', sumBy(orders, (order) => order.orderCount)),
  createCard('照片总张数', sumBy(orders, (order) => order.photoCount)),
  createCard('接单总价', sumBy(orders, (order) => order.receiveTotal)),
  createCard('派单总价', sumBy(orders, (order) => order.dispatchTotal)),
  createCard('利润', sumBy(orders, (order) => order.profit)),
]
