<template>
  <section class="designer-shell">
    <header class="designer-topbar">
      <div class="brand" role="button" tabindex="0" @click="router.push('/designer/orders')" @keydown.enter="router.push('/designer/orders')">
        <el-icon class="brand-mark" aria-hidden="true">
          <Grid />
        </el-icon>
        <span class="brand-title">管理系统</span>
      </div>

      <div class="user-area">
        <span class="user-name">{{ userName }}</span>
        <button class="user-avatar" type="button" title="退出登录" @click="handleLogout">{{ avatarText }}</button>
      </div>
    </header>

    <main class="designer-main">
      <slot>
        <RouterView />
      </slot>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Grid } from '@element-plus/icons-vue'
import { RouterView, useRouter } from 'vue-router'
import { clearAuthStorage, getStoredUser } from '../libs/request/auth'

const router = useRouter()
const user = computed(() => getStoredUser())
const userName = computed(() => user.value?.realName || user.value?.username || '林设计')
const avatarText = computed(() => userName.value.slice(0, 1))

const handleLogout = () => {
  clearAuthStorage()
  router.replace({ name: 'Login' })
}
</script>

<style scoped lang="scss">
.designer-shell {
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
    animation: designerRingSweep 14s ease-in-out infinite alternate;
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

.designer-topbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
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
    animation: designerOrbFloat 8s ease-in-out infinite alternate;
  }

  &::after {
    inset: auto -8% -34px -8%;
    height: 76px;
    background:
      radial-gradient(circle, rgba(47, 125, 246, 0.18) 0 1px, transparent 1.8px) 0 0 / 18px 18px,
      linear-gradient(95deg, rgba(117, 220, 255, 0.18), rgba(255, 255, 255, 0.58));
    clip-path: polygon(0 46%, 13% 57%, 28% 48%, 43% 64%, 61% 47%, 78% 61%, 100% 42%, 100% 100%, 0 100%);
    opacity: 0.62;
    animation: designerWaveDriftBack 11s ease-in-out infinite alternate;
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
  place-items: center;
  color: var(--copy-blue);
  font-weight: 800;
  cursor: pointer;
  background:
    radial-gradient(circle at 70% 18%, rgba(255, 255, 255, 0.9), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(214, 241, 255, 0.58));
  border-radius: 50%;
  box-shadow:
    inset 0 0 16px rgba(255, 255, 255, 0.72),
    0 10px 24px rgba(39, 120, 246, 0.16);
}

.designer-main {
  position: relative;
  z-index: 1;
  min-height: 0;
  padding: 24px 24px 10px;
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
    animation: designerPanelFloat 7s ease-in-out infinite alternate;
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
    animation: designerParticleDrift 6.4s ease-in-out infinite alternate;
  }

  > :deep(*) {
    position: relative;
    z-index: 1;
  }
}

@keyframes designerWaveDriftBack {
  from {
    transform: translate3d(22px, 0, 0) scaleY(1);
  }
  to {
    transform: translate3d(-28px, -14px, 0) scaleY(1.06);
  }
}

@keyframes designerOrbFloat {
  from {
    transform: translate3d(-10px, 12px, 0) scale(0.96);
  }
  to {
    transform: translate3d(16px, -18px, 0) scale(1.08);
  }
}

@keyframes designerRingSweep {
  from {
    transform: rotate(8deg) translate3d(-12px, 0, 0);
  }
  to {
    transform: rotate(24deg) translate3d(20px, 16px, 0);
  }
}

@keyframes designerParticleDrift {
  from {
    transform: translate3d(-12px, 10px, 0);
  }
  to {
    transform: translate3d(18px, -18px, 0);
  }
}

@keyframes designerPanelFloat {
  from {
    transform: translate3d(0, 12px, 0);
  }
  to {
    transform: translate3d(0, -14px, 0);
  }
}

@media (max-width: 768px) {
  .designer-shell {
    grid-template-rows: auto minmax(0, 1fr);
  }

  .designer-topbar {
    height: auto;
    min-height: 72px;
    padding: 16px 18px;
  }

  .brand-title {
    font-size: 20px;
  }

  .designer-main {
    padding: 16px;
  }
}
</style>
