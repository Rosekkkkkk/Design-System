<template>
  <section class="manager-shell">
    <header class="manager-topbar">
      <div class="brand" role="button" tabindex="0" @click="goHome" @keydown.enter="goHome">
        <el-icon class="brand-mark" aria-hidden="true">
          <Grid />
        </el-icon>
        <span class="brand-title">管理系统</span>
      </div>

      <div class="user-area">
        <span class="user-name">{{ userName }}</span>
        <el-dropdown trigger="click" @command="handleUserCommand">
          <button class="user-avatar" type="button" title="账户菜单">
            <el-icon>
              <User />
            </el-icon>
          </button>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="account">修改账户</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <div class="manager-body">
      <aside class="sidebar">
        <nav class="sidebar-menu" aria-label="后台菜单">
          <button v-for="item in visibleMenus" :key="item.path" :class="{ active: isActive(item.path) }" type="button" @click="router.push(item.path)">
            <span class="menu-icon" aria-hidden="true">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </nav>
      </aside>

      <main class="manager-main">
        <slot>
          <RouterView />
        </slot>
      </main>
    </div>

    <el-dialog v-model="accountDialogVisible" class="account-settings-dialog" title="个人设置" width="480px" :show-close="false" destroy-on-close>
      <el-form ref="accountFormRef" class="account-settings-form" :model="accountForm" :rules="accountRules" label-position="left">
        <el-form-item label="用户名" prop="realName">
          <el-input v-model="accountForm.realName" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="当前角色" prop="roleName">
          <el-input v-model="accountForm.roleName" disabled />
        </el-form-item>

        <el-form-item label="登录账号" prop="username">
          <el-input v-model="accountForm.username" placeholder="请输入登录账号" />
        </el-form-item>

        <el-form-item label="登录密码" prop="password">
          <el-input v-model="accountForm.password" placeholder="请输入登录密码" show-password type="password" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="accountDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAccount">保存修改</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Grid, User } from '@element-plus/icons-vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { clearAuthStorage, getStoredUser, setStoredUser } from '../libs/request/auth'
import type { StoredUser } from '../libs/request/auth'

type ManagerRole = 'DISPATCHER' | 'ADMIN'

interface MenuItem {
  label: string
  path: string
  icon: string
  roles: ManagerRole[]
}

interface AccountForm {
  realName: string
  roleName: string
  username: string
  password: string
}

const route = useRoute()
const router = useRouter()
const storedUser = ref<StoredUser | null>(getStoredUser())
const accountDialogVisible = ref(false)
const accountFormRef = ref<FormInstance>()
const accountForm = reactive<AccountForm>({
  realName: '',
  roleName: '',
  username: '',
  password: ''
})

const roleNameMap = {
  DISPATCHER: '调度主管',
  ADMIN: '超级管理'
} as const

const requiredRule = (message: string) => [{ required: true, whitespace: true, message, trigger: 'blur' }]

const accountRules = reactive<FormRules<AccountForm>>({
  realName: requiredRule('请输入用户名'),
  roleName: requiredRule('请输入当前角色'),
  username: requiredRule('请输入登录账号'),
  password: requiredRule('请输入登录密码')
})

const menus: MenuItem[] = [
  { label: '全部订单', path: '/orders', icon: '目', roles: ['DISPATCHER', 'ADMIN'] },
  { label: '基础资料', path: '/master-data', icon: '◉', roles: ['DISPATCHER', 'ADMIN'] },
  { label: '用户管理', path: '/user-management', icon: '♙', roles: ['ADMIN'] }
]

const userRole = computed<ManagerRole>(() => (storedUser.value?.role === 'ADMIN' ? 'ADMIN' : 'DISPATCHER'))
const userName = computed(() => storedUser.value?.realName || storedUser.value?.username || roleNameMap[userRole.value])
// const visibleMenus = computed(() => menus.filter(item => item.roles.includes(userRole.value)))
const visibleMenus = computed(() => menus)

const isActive = (path: string) => route.path === path || route.path.startsWith(`${path}/`)

const goHome = () => {
  router.push('/orders')
}

const handleLogout = () => {
  clearAuthStorage()
  router.replace({ name: 'Login' })
}

const handleUserCommand = (command: string | number | object) => {
  if (command === 'logout') {
    handleLogout()
    return
  }

  if (command === 'account') {
    openAccountDialog()
  }
}

const openAccountDialog = () => {
  accountForm.realName = storedUser.value?.realName || userName.value
  accountForm.roleName = roleNameMap[userRole.value]
  accountForm.username = storedUser.value?.username || ''
  accountForm.password = ''
  accountDialogVisible.value = true
  accountFormRef.value?.clearValidate()
}

const handleSaveAccount = async () => {
  if (!accountFormRef.value) return

  try {
    await accountFormRef.value.validate()
  } catch {
    return
  }

  if (!storedUser.value) {
    accountDialogVisible.value = false
    return
  }

  const nextUser = {
    ...storedUser.value,
    realName: accountForm.realName,
    username: accountForm.username
  }

  setStoredUser(nextUser)
  storedUser.value = nextUser
  accountDialogVisible.value = false
  ElMessage.success('保存成功')
}
</script>

<style scoped lang="scss">
.manager-shell {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-rows: 72px minmax(0, 1fr);
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at 100% 66%, rgba(31, 105, 241, 0.34), transparent 18%), linear-gradient(180deg, #0b2a5a 0 72px, #061a3a 72px 100%);

  &::before,
  &::after {
    position: fixed;
    z-index: 0;
    content: '';
    pointer-events: none;
    border: 1px solid rgba(65, 135, 255, 0.24);
    border-color: rgba(65, 135, 255, 0.24) transparent transparent transparent;
    border-radius: 50%;
  }

  &::before {
    right: -105px;
    bottom: 205px;
    width: 420px;
    height: 220px;
    transform: rotate(12deg);
  }

  &::after {
    left: -180px;
    bottom: 160px;
    width: 560px;
    height: 260px;
    transform: rotate(10deg);
  }
}

.manager-topbar {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 28px;
  background: #0b2a5a;
}

.brand {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  height: 32px;
  padding: 0;
  color: #fff;
  cursor: pointer;
}

.brand-mark {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 32px;
  color: #fff;
  font-size: 26px;
  line-height: 1;

  :deep(svg) {
    display: block;
    width: 1em;
    height: 1em;
  }
}

.brand-title {
  display: inline-flex;
  align-items: center;
  height: 32px;
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
}

.user-area {
  display: inline-flex;
  gap: 12px;
  align-items: center;
}

.user-name {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.user-avatar {
  display: grid;
  width: 36px;
  height: 36px;
  padding: 0;
  place-items: center;
  color: #1153d8;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  background: #dbe9ff;
  border: 0;
  border-radius: 50%;

  :deep(svg) {
    display: block;
    width: 1em;
    height: 1em;
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

  :deep(.el-input__wrapper) {
    min-height: 36px;
    border-radius: 6px;
    box-shadow: 0 0 0 1px #d4dfef inset;
  }

  :deep(.el-input__inner) {
    color: #001b44;
    font-size: 14px;
  }

  :deep(.el-input__inner::placeholder) {
    color: #9db0ca;
  }
}

.manager-body {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
}

.sidebar {
  background: rgba(3, 18, 42, 0.82);
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  padding-top: 8px;

  button {
    display: flex;
    gap: 13px;
    align-items: center;
    width: 220px;
    height: 56px;
    padding: 0 0 0 69px;
    color: #fff;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    text-align: left;
    cursor: pointer;
    background: transparent;

    &.active {
      background: #2b66e8;
    }
  }
}

.menu-icon {
  width: 12px;
  color: #fff;
  font-size: 14px;
  line-height: 1;
  text-align: center;
}

.manager-main {
  min-width: 0;
  min-height: 0;
  padding: 18px;
  overflow: hidden;
}

@media (max-width: 980px) {
  .manager-body {
    grid-template-columns: 1fr;
  }

  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
    padding: 10px;

    button {
      width: auto;
      min-width: 118px;
      height: 44px;
      padding: 0 18px;
      white-space: nowrap;
    }
  }

  .manager-main {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .manager-topbar {
    height: auto;
    min-height: 72px;
    padding: 16px 18px;
  }

  .brand-title {
    font-size: 20px;
  }
}
</style>
