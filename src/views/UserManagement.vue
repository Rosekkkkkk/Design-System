<template>
  <section class="user-management-view">
    <header class="user-management-header">
      <h1>用户管理</h1>
      <el-button class="add-user-button" type="primary" :icon="Plus" @click="openCreateDialog">新增用户</el-button>
    </header>

    <main class="user-management-body">
      <el-form class="user-filter" :model="filters" inline @submit.prevent>
        <el-form-item>
          <el-input v-model="filters.keyword" clearable placeholder="输入用户名或账号" @keyup.enter="handleSearch" />
        </el-form-item>

        <el-form-item>
          <el-select v-model="filters.role" clearable placeholder="角色筛选">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class="query-button" type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="user-table-panel">
        <el-table :data="pagedUsers" border height="100%">
          <el-table-column label="用户名" min-width="352" prop="realName" />
          <el-table-column label="登录账号" min-width="392" prop="username" />
          <el-table-column label="当前角色" min-width="150">
            <template #default="{ row }">
              {{ getRoleLabel(row.role) }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="410" prop="createdAt" />
          <el-table-column fixed="right" label="操作" min-width="158">
            <template #default="{ row }">
              <el-button class="edit-button" plain size="small" type="primary" @click="openEditDialog(row)">编辑</el-button>
              <el-button class="delete-button" plain size="small" type="danger" @click="handleDeleteUser(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <footer class="user-pagination">
        <el-pagination v-model:current-page="pagination.pageNo" v-model:page-size="pagination.pageSize" :pager-count="5" :total="filteredUsers.length" layout="total, prev, pager, next, jumper" />
      </footer>
    </main>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" class="account-settings-dialog" width="480px" :show-close="false" destroy-on-close>
      <el-form ref="userFormRef" class="account-settings-form" :model="userForm" :rules="userRules" label-position="left">
        <el-form-item label="用户名" prop="realName">
          <el-input v-model="userForm.realName" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="当前角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择当前角色">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="登录账号" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入登录账号" />
        </el-form-item>

        <el-form-item label="登录密码" prop="password">
          <el-input v-model="userForm.password" placeholder="请输入登录密码" show-password type="password" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveUser">保存修改</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UserRole } from '../api/types'

type UserTableRole = Extract<UserRole, 'ADMIN' | 'DISPATCHER' | 'DESIGNER'>
type DialogMode = 'create' | 'edit'

interface UserRecord {
  id: number
  realName: string
  username: string
  role: UserTableRole
  createdAt: string
}

interface UserFilters {
  keyword: string
  role: UserTableRole | ''
}

interface UserForm {
  id?: number
  realName: string
  username: string
  password: string
  role: UserTableRole
}

const roleLabelMap: Record<UserTableRole, string> = {
  ADMIN: '超级管理员',
  DISPATCHER: '调度',
  DESIGNER: '设计师'
}

const roleOptions: Array<{ label: string; value: UserTableRole }> = [
  { label: '超级管理员', value: 'ADMIN' },
  { label: '调度', value: 'DISPATCHER' },
  { label: '设计师', value: 'DESIGNER' }
]

const getRoleLabel = (role: UserTableRole) => roleLabelMap[role]

const filters = reactive<UserFilters>({
  keyword: '',
  role: ''
})

const activeFilters = reactive<UserFilters>({
  keyword: '',
  role: ''
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 17
})

const dialogVisible = ref(false)
const dialogMode = ref<DialogMode>('create')
const userFormRef = ref<FormInstance>()
const userForm = reactive<UserForm>({
  realName: '',
  username: '',
  password: '',
  role: 'DISPATCHER'
})

const sourceUsers = ref<UserRecord[]>(
  Array.from({ length: 72 }, (_, index) => {
    const baseRows: Array<Omit<UserRecord, 'id' | 'createdAt'>> = [
      { realName: '超级管理员', username: 'admin', role: 'ADMIN' },
      { realName: '调度主管', username: 'dispatcher01', role: 'DISPATCHER' },
      { realName: '调度A', username: 'dispatcher02', role: 'DISPATCHER' },
      { realName: '林设计', username: 'designer01', role: 'DESIGNER' },
      { realName: '陈设计', username: 'designer02', role: 'DESIGNER' },
      { realName: '周设计', username: 'designer03', role: 'DESIGNER' }
    ]
    const base = baseRows[index % baseRows.length]
    const suffix = index < 6 ? '' : String(index)

    return {
      ...base,
      id: index + 1,
      realName: `${base.realName}${suffix}`,
      createdAt: `2026-04-${String(index + 1).padStart(2, '0')} 09:00:00`
    }
  })
)

const dialogTitle = computed(() => (dialogMode.value === 'edit' ? '编辑用户' : '新增用户'))

const filteredUsers = computed(() => {
  const keyword = activeFilters.keyword.trim().toLowerCase()

  return sourceUsers.value.filter(item => {
    const matchKeyword = !keyword || item.realName.toLowerCase().includes(keyword) || item.username.toLowerCase().includes(keyword)
    const matchRole = !activeFilters.role || item.role === activeFilters.role

    return matchKeyword && matchRole
  })
})

const pagedUsers = computed(() => {
  const start = (pagination.pageNo - 1) * pagination.pageSize

  return filteredUsers.value.slice(start, start + pagination.pageSize)
})

const requiredRule = (message: string) => [{ required: true, whitespace: true, message, trigger: 'blur' }]

const userRules = computed<FormRules<UserForm>>(() => ({
  realName: requiredRule('请输入用户名'),
  username: requiredRule('请输入登录账号'),
  password: requiredRule('请输入登录密码'),
  role: [{ required: true, message: '请选择当前角色', trigger: 'change' }]
}))

const resetUserForm = () => {
  userForm.id = undefined
  userForm.realName = ''
  userForm.username = ''
  userForm.password = ''
  userForm.role = 'DISPATCHER'
}

const handleSearch = () => {
  activeFilters.keyword = filters.keyword
  activeFilters.role = filters.role
  pagination.pageNo = 1
}

const openCreateDialog = () => {
  dialogMode.value = 'create'
  resetUserForm()
  dialogVisible.value = true
  userFormRef.value?.clearValidate()
}

const openEditDialog = (row: UserRecord) => {
  dialogMode.value = 'edit'
  userForm.id = row.id
  userForm.realName = row.realName
  userForm.username = row.username
  userForm.password = ''
  userForm.role = row.role
  dialogVisible.value = true
  userFormRef.value?.clearValidate()
}

const handleSaveUser = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()
  } catch {
    return
  }

  if (dialogMode.value === 'edit' && userForm.id) {
    sourceUsers.value = sourceUsers.value.map(item =>
      item.id === userForm.id
        ? {
            ...item,
            realName: userForm.realName,
            username: userForm.username,
            role: userForm.role
          }
        : item
    )
  } else {
    sourceUsers.value = [
      {
        id: Date.now(),
        realName: userForm.realName,
        username: userForm.username,
        role: userForm.role,
        createdAt: '2026-04-27 09:00:00'
      },
      ...sourceUsers.value
    ]
  }

  dialogVisible.value = false
  ElMessage.success('保存成功')
}

const handleDeleteUser = async (row: UserRecord) => {
  try {
    await ElMessageBox.confirm(`确定删除账号“${row.username}”吗？删除后不可恢复。`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
  } catch {
    return
  }

  sourceUsers.value = sourceUsers.value.filter(item => item.id !== row.id)

  if (pagedUsers.value.length === 0 && pagination.pageNo > 1) {
    pagination.pageNo -= 1
  }

  ElMessage.success('删除成功')
}
</script>

<style scoped lang="scss">
.user-management-view {
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

.user-management-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid #e8eef7;

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
  }
}

.add-user-button {
  width: 91px;
  height: 36px;
  padding: 0;
  font-size: 14px;
  font-weight: 800;
  border-radius: 8px;
}

.user-management-body {
  display: grid;
  grid-template-rows: 64px minmax(0, 1fr) 72px;
  min-height: 0;
  overflow: hidden;
}

.user-filter {
  display: grid;
  grid-template-columns: 182px 226px 62px;
  gap: 10px;
  align-items: center;
  align-content: center;
  padding: 0 22px;
  margin: 0;
  background: #f8fbff;
  border-bottom: 1px solid #e1e9f5;

  :deep(.el-form-item) {
    margin: 0;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 34px;
    border-radius: 5px;
    box-shadow: 0 0 0 1px #d8e2f1 inset;
  }

  :deep(.el-input__inner),
  :deep(.el-select__placeholder) {
    color: #001b44;
    font-size: 14px;
  }

  :deep(.el-input__inner::placeholder),
  :deep(.el-select__placeholder) {
    color: #9db0ca;
  }
}

.query-button {
  width: 62px;
  height: 34px;
  padding: 0;
  font-size: 14px;
  font-weight: 800;
  border-radius: 8px;
}

.user-table-panel {
  min-height: 0;
  padding: 0 22px;
  overflow: hidden;
  background: #fff;

  :deep(.el-table) {
    --el-table-border-color: #dfe7f2;
    --el-table-header-bg-color: #f3f6fb;
    --el-table-row-hover-bg-color: #f8fbff;
    --el-table-tr-bg-color: #fff;
    --el-table-text-color: #001b44;
    --el-table-header-text-color: #001b44;
    font-size: 14px;
  }

  :deep(.el-table__inner-wrapper::before) {
    background: #dfe7f2;
  }

  :deep(.el-table__header th) {
    height: 40px;
    font-weight: 800;
    background: #f3f6fb;
  }

  :deep(.el-table__row td) {
    height: 42px;
    font-weight: 500;
  }

  :deep(.el-table__cell) {
    padding: 0;
  }

  :deep(.cell) {
    padding: 0 12px;
    line-height: 40px;
  }
}

.edit-button,
.delete-button {
  font-weight: 700;
}

.user-pagination {
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.el-pagination) {
    --el-pagination-font-size: 14px;
    color: #6d7f9a;
    font-weight: 500;
  }

  :deep(.el-pager) {
    gap: 6px;
  }

  :deep(.el-pagination button),
  :deep(.el-pager li) {
    min-width: 32px;
    height: 32px;
    border: 1px solid #d8e5f8;
    border-radius: 8px;
  }

  :deep(.el-pagination button:disabled) {
    background: #fff;
  }

  :deep(.el-pager li.is-active) {
    color: #fff;
    background: #2563eb;
    border-color: #2563eb;
  }

  :deep(.el-pagination__jump) {
    margin-left: 18px;
  }

  :deep(.el-pagination__editor.el-input) {
    width: 48px;
  }
}

:deep(.account-settings-dialog) {
  --el-dialog-padding-primary: 0;
  overflow: hidden;
  border-radius: 12px;
}

:deep(.account-settings-dialog .el-dialog__header) {
  padding: 24px 26px 18px;
  border-bottom: 1px solid #e6edf7;
}

:deep(.account-settings-dialog .el-dialog__title) {
  color: #001b44;
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}

:deep(.account-settings-dialog .el-dialog__body) {
  padding: 28px 64px 40px 42px;
}

:deep(.account-settings-dialog .el-dialog__footer) {
  padding: 0 20px 14px;
}

.account-settings-form {
  display: grid;
  gap: 18px;

  :deep(.el-form-item) {
    align-items: center;
    margin: 0;
  }

  :deep(.el-form-item__label) {
    flex: 0 0 90px;
    width: 90px;
    padding-right: 0;
    color: #001b44;
    font-size: 14px;
    line-height: 36px;
    white-space: nowrap;
  }

  :deep(.el-form-item__content) {
    min-width: 0;
  }

  :deep(.el-form-item__error) {
    padding-top: 3px;
    color: #f56c6c;
    font-size: 12px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 36px;
    border-radius: 6px;
    box-shadow: 0 0 0 1px #d4dfef inset;
  }

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-input__inner) {
    color: #001b44;
    font-size: 14px;
  }

  :deep(.el-input__inner::placeholder) {
    color: #9db0ca;
  }
}

@media (max-width: 980px) {
  .user-filter {
    grid-template-columns: 1fr;
    padding: 14px 18px;
  }

  .user-management-body {
    grid-template-rows: auto minmax(0, 1fr) 72px;
  }

  .user-table-panel {
    padding: 0 18px;
  }
}
</style>
