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
  { label: '商户管理', path: '/master-data', icon: '◉', roles: ['DISPATCHER', 'ADMIN'] },
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
  --copy-blue: #2778f6;
  --copy-blue-deep: #145ee6;
  --copy-cyan: #6ae5f4;
  --copy-ink: #0d1d38;
  --copy-muted: #7c8ba3;
  --copy-line: rgba(138, 180, 235, 0.32);

  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-rows: 72px minmax(0, 1fr);
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  color: var(--copy-ink);
  background:
    radial-gradient(circle at 8% 10%, rgba(255, 255, 255, 0.92), transparent 28%),
    radial-gradient(circle at 82% 24%, rgba(156, 215, 255, 0.58), transparent 34%),
    radial-gradient(circle at 76% 78%, rgba(105, 224, 240, 0.34), transparent 34%),
    linear-gradient(135deg, #fbfdff 0%, #edf6ff 38%, #dceeff 100%);

  &::before,
  &::after {
    position: fixed;
    z-index: 0;
    content: '';
    pointer-events: none;
    border: 2px solid transparent;
    border-top-color: rgba(126, 238, 243, 0.42);
    border-right-color: rgba(255, 255, 255, 0.72);
    border-radius: 50%;
    filter: drop-shadow(0 0 18px rgba(98, 216, 245, 0.2));
    opacity: 0.58;
    animation: layoutRingSweep 14s ease-in-out infinite alternate;
  }

  &::before {
    top: -260px;
    right: 12%;
    width: 520px;
    height: 520px;
  }

  &::after {
    right: -170px;
    bottom: -210px;
    width: 620px;
    height: 620px;
    border-top-color: rgba(255, 255, 255, 0.64);
    border-left-color: rgba(103, 198, 255, 0.26);
    animation-delay: -6s;
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
  overflow: hidden;
  background:
    radial-gradient(circle at 8% 0%, rgba(255, 255, 255, 0.94), transparent 34%),
    radial-gradient(circle at 86% 24%, rgba(106, 229, 244, 0.28), transparent 30%),
    linear-gradient(105deg, rgba(255, 255, 255, 0.72), rgba(219, 243, 255, 0.5));
  border-bottom: 1px solid rgba(255, 255, 255, 0.88);
  box-shadow:
    inset 0 -1px 0 rgba(255, 255, 255, 0.64),
    0 16px 36px rgba(73, 122, 186, 0.14);
  backdrop-filter: blur(18px);

  &::before,
  &::after {
    position: absolute;
    content: '';
    pointer-events: none;
  }

  &::before {
    top: -150px;
    right: 7%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(83, 218, 243, 0.48), transparent 68%);
    border-radius: 999px;
    filter: blur(10px);
    animation: layoutOrbFloat 8s ease-in-out infinite alternate;
  }

  &::after {
    inset: auto -8% -34px -8%;
    height: 76px;
    background:
      radial-gradient(circle, rgba(47, 125, 246, 0.18) 0 1px, transparent 1.8px) 0 0 / 18px 18px,
      linear-gradient(95deg, rgba(117, 220, 255, 0.18), rgba(255, 255, 255, 0.58));
    clip-path: polygon(0 46%, 13% 57%, 28% 48%, 43% 64%, 61% 47%, 78% 61%, 100% 42%, 100% 100%, 0 100%);
    opacity: 0.62;
    animation: layoutWaveDriftBack 11s ease-in-out infinite alternate;
  }

  > * {
    position: relative;
    z-index: 1;
  }
}

.brand {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  height: 32px;
  padding: 0;
  color: var(--copy-ink);
  cursor: pointer;
}

.brand-mark {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 32px;
  color: var(--copy-blue);
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
  color: #17243d;
}

.user-area {
  display: inline-flex;
  gap: 12px;
  align-items: center;
}

.user-name {
  color: #17243d;
  font-size: 14px;
  font-weight: 500;
}

.user-avatar {
  display: grid;
  width: 36px;
  height: 36px;
  padding: 0;
  place-items: center;
  color: var(--copy-blue);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  background:
    radial-gradient(circle at 70% 18%, rgba(255, 255, 255, 0.9), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(214, 241, 255, 0.58));
  border: 0;
  border-radius: 50%;
  box-shadow:
    inset 0 0 16px rgba(255, 255, 255, 0.72),
    0 10px 24px rgba(39, 120, 246, 0.16);

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
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 8%, rgba(255, 255, 255, 0.86), transparent 30%),
    radial-gradient(circle at 82% 58%, rgba(106, 229, 244, 0.22), transparent 34%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.58), rgba(219, 243, 255, 0.36));
  border-right: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow:
    inset -1px 0 0 rgba(255, 255, 255, 0.54),
    16px 0 38px rgba(73, 122, 186, 0.1);
  backdrop-filter: blur(18px);

  &::before,
  &::after {
    position: absolute;
    content: '';
    pointer-events: none;
  }

  &::before {
    inset: auto -42% -10% -42%;
    height: 38%;
    background:
      radial-gradient(circle, rgba(255, 255, 255, 0.86) 0 1.4px, transparent 2px) 0 0 / 22px 22px,
      linear-gradient(100deg, rgba(255, 255, 255, 0.62), rgba(115, 198, 255, 0.2), rgba(255, 255, 255, 0.48));
    clip-path: polygon(0 34%, 10% 43%, 20% 38%, 32% 52%, 45% 42%, 58% 56%, 72% 45%, 86% 58%, 100% 49%, 100% 100%, 0 100%);
    opacity: 0.72;
    animation: layoutWaveDrift 9s ease-in-out infinite alternate;
  }

  &::after {
    inset: 0;
    background:
      radial-gradient(circle at 18% 24%, rgba(255, 255, 255, 0.92) 0 2px, transparent 3px),
      radial-gradient(circle at 72% 38%, rgba(255, 255, 255, 0.82) 0 1.8px, transparent 3px),
      radial-gradient(circle at 42% 66%, rgba(255, 255, 255, 0.86) 0 2px, transparent 3px),
      linear-gradient(120deg, transparent 0 34%, rgba(113, 171, 235, 0.2) 34.2% 34.6%, transparent 34.8%),
      linear-gradient(54deg, transparent 0 48%, rgba(113, 171, 235, 0.22) 48.2% 48.6%, transparent 48.8%);
    opacity: 0.5;
    animation: layoutParticleDrift 5.6s ease-in-out infinite alternate;
  }
}

.sidebar-menu {
  position: relative;
  z-index: 1;
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
    color: #17243d;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    text-align: left;
    cursor: pointer;
    background: transparent;
    transition:
      color 0.18s ease,
      background-color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.18s ease;

    &:hover {
      color: var(--copy-blue-deep);
      background: rgba(255, 255, 255, 0.32);
      transform: translateX(2px);
    }

    &.active {
      color: #fff;
      background:
        radial-gradient(circle at 92% 18%, rgba(255, 255, 255, 0.9), transparent 11%),
        linear-gradient(105deg, #1f72f2 0%, #2688ff 58%, #33c8f2 100%);
      box-shadow:
        0 14px 26px rgba(39, 120, 246, 0.24),
        0 0 0 1px rgba(255, 255, 255, 0.26) inset;
    }
  }
}

.menu-icon {
  width: 12px;
  color: currentColor;
  font-size: 14px;
  line-height: 1;
  text-align: center;
}

.manager-main {
  position: relative;
  min-width: 0;
  min-height: 0;
  padding: 18px;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.74), transparent 28%),
    radial-gradient(circle at 86% 16%, rgba(106, 229, 244, 0.18), transparent 30%),
    radial-gradient(circle at 72% 82%, rgba(39, 120, 246, 0.12), transparent 34%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(220, 238, 255, 0.28));

  &::before,
  &::after {
    position: absolute;
    content: '';
    pointer-events: none;
  }

  &::before {
    top: 34px;
    right: 42px;
    width: 272px;
    height: 176px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.68) 0 7px, transparent 7px 17px) 32px 32px / 132px 17px no-repeat,
      linear-gradient(180deg, rgba(111, 235, 233, 0.46), rgba(255, 255, 255, 0.46)) 174px 88px / 18px 54px no-repeat,
      linear-gradient(180deg, rgba(111, 235, 233, 0.52), rgba(255, 255, 255, 0.5)) 204px 66px / 18px 76px no-repeat,
      linear-gradient(180deg, rgba(111, 235, 233, 0.4), rgba(255, 255, 255, 0.44)) 234px 98px / 18px 44px no-repeat,
      linear-gradient(145deg, rgba(255, 255, 255, 0.42), rgba(214, 241, 255, 0.2));
    border: 1px solid rgba(255, 255, 255, 0.66);
    border-radius: 18px;
    box-shadow:
      inset 0 0 24px rgba(255, 255, 255, 0.4),
      0 22px 46px rgba(105, 156, 216, 0.12);
    opacity: 0.42;
    backdrop-filter: blur(12px);
    animation: layoutPanelFloat 7s ease-in-out infinite alternate;
  }

  &::after {
    inset: 0;
    background:
      radial-gradient(circle at 9% 18%, rgba(255, 255, 255, 0.88) 0 1.8px, transparent 3px),
      radial-gradient(circle at 21% 42%, rgba(255, 255, 255, 0.76) 0 1.4px, transparent 2.6px),
      radial-gradient(circle at 44% 22%, rgba(255, 255, 255, 0.82) 0 1.6px, transparent 2.8px),
      radial-gradient(circle at 72% 44%, rgba(255, 255, 255, 0.78) 0 1.6px, transparent 2.8px),
      radial-gradient(circle at 88% 72%, rgba(255, 255, 255, 0.82) 0 1.8px, transparent 3px),
      linear-gradient(36deg, transparent 0 31%, rgba(113, 171, 235, 0.12) 31.1% 31.3%, transparent 31.5%),
      linear-gradient(118deg, transparent 0 58%, rgba(113, 171, 235, 0.14) 58.1% 58.3%, transparent 58.5%);
    opacity: 0.52;
    animation: layoutParticleDrift 6.4s ease-in-out infinite alternate;
  }

  > :deep(*) {
    position: relative;
    z-index: 1;
  }
}

@keyframes layoutWaveDrift {
  from {
    transform: translate3d(-18px, 0, 0) scaleY(1);
  }
  to {
    transform: translate3d(28px, -18px, 0) scaleY(1.08);
  }
}

@keyframes layoutWaveDriftBack {
  from {
    transform: translate3d(22px, 0, 0) scaleY(1);
  }
  to {
    transform: translate3d(-28px, -14px, 0) scaleY(1.06);
  }
}

@keyframes layoutOrbFloat {
  from {
    transform: translate3d(-10px, 12px, 0) scale(0.96);
  }
  to {
    transform: translate3d(16px, -18px, 0) scale(1.08);
  }
}

@keyframes layoutRingSweep {
  from {
    transform: rotate(8deg) translate3d(-12px, 0, 0);
  }
  to {
    transform: rotate(24deg) translate3d(20px, 16px, 0);
  }
}

@keyframes layoutParticleDrift {
  from {
    transform: translate3d(-12px, 10px, 0);
  }
  to {
    transform: translate3d(18px, -18px, 0);
  }
}

@keyframes layoutPanelFloat {
  from {
    transform: translate3d(0, 12px, 0);
  }
  to {
    transform: translate3d(0, -14px, 0);
  }
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
