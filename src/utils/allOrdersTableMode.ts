export type AllOrdersTableMode = 'detail' | 'summary'

interface TableModeSwitchOption {
  mode: AllOrdersTableMode
  label: string
  isActive: boolean
}

const tableModeSwitchLabels: Record<AllOrdersTableMode, string> = {
  detail: '详情',
  summary: '汇总',
}

export const createTableModeSwitchOptions = (activeMode: AllOrdersTableMode): TableModeSwitchOption[] =>
  (Object.keys(tableModeSwitchLabels) as AllOrdersTableMode[]).map((mode) => ({
    mode,
    label: tableModeSwitchLabels[mode],
    isActive: mode === activeMode,
  }))
