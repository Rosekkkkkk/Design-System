import { getPagedRows, mergePagedSelection } from './allOrdersSelection.ts'

interface Row {
  id: number
  name: string
}

const rows: Row[] = Array.from({ length: 35 }, (_, index) => ({
  id: index + 1,
  name: `row-${index + 1}`,
}))

const getRowKey = (row: Row) => row.id

const assertDeepEqual = <T>(actual: T, expected: T, message: string) => {
  const actualJson = JSON.stringify(actual)
  const expectedJson = JSON.stringify(expected)

  if (actualJson !== expectedJson) {
    throw new Error(`${message}: expected ${expectedJson}, received ${actualJson}`)
  }
}

const firstPageRows = getPagedRows(rows, 1, 15)
const secondPageRows = getPagedRows(rows, 2, 15)
const firstPageSelection = [firstPageRows[0], firstPageRows[2]]

const afterFirstPage = mergePagedSelection([], firstPageSelection, firstPageRows, getRowKey)
const afterSecondPage = mergePagedSelection(afterFirstPage, [secondPageRows[1]], secondPageRows, getRowKey)

assertDeepEqual(
  afterSecondPage.map((row) => row.id),
  [1, 3, 17],
  '累加不同分页里勾选的数据',
)

const previousSelection = [firstPageRows[0], firstPageRows[2], secondPageRows[1]]
const nextSelection = mergePagedSelection(previousSelection, [firstPageRows[2]], firstPageRows, getRowKey)

assertDeepEqual(
  nextSelection.map((row) => row.id),
  [17, 3],
  '只刷新当前页的勾选状态，保留其他分页已选数据',
)

const expandedFirstPageRows = getPagedRows(rows, 1, 30)
const selectionAfterPageSizeChange = mergePagedSelection([secondPageRows[1]], [secondPageRows[1]], expandedFirstPageRows, getRowKey)

assertDeepEqual(
  selectionAfterPageSizeChange.map((row) => row.id),
  [17],
  'pageSize 变大后已选数据进入第一页时仍保持勾选集合',
)
