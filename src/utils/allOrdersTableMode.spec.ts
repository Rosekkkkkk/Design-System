import { createTableModeSwitchOptions, type AllOrdersTableMode } from './allOrdersTableMode'

const detailOptions = createTableModeSwitchOptions('detail')
const summaryOptions = createTableModeSwitchOptions('summary')

detailOptions satisfies Array<{ mode: AllOrdersTableMode; label: string; isActive: boolean }>
summaryOptions satisfies Array<{ mode: AllOrdersTableMode; label: string; isActive: boolean }>

const detailActiveLabel: '详情' = detailOptions.find((item) => item.isActive)?.label as '详情'
const summaryActiveLabel: '汇总' = summaryOptions.find((item) => item.isActive)?.label as '汇总'

void detailActiveLabel
void summaryActiveLabel
