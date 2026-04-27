<template>
  <main class="login-copy-page">
    <div class="login-copy-background" aria-hidden="true">
      <span class="light-orb orb-a"></span>
      <span class="light-orb orb-b"></span>
      <span class="aurora-ring ring-a"></span>
      <span class="aurora-ring ring-b"></span>
      <span class="network-line line-a"></span>
      <span class="network-line line-b"></span>
      <span class="network-line line-c"></span>
      <span class="meteor-streak meteor-a"></span>
      <span class="meteor-streak meteor-b"></span>
      <span class="meteor-streak meteor-c"></span>
      <span class="meteor-streak meteor-d"></span>
      <span class="meteor-streak meteor-e"></span>
      <span class="pulse-node node-a"></span>
      <span class="pulse-node node-b"></span>
      <span class="pulse-node node-c"></span>

      <div class="data-panel panel-chart">
        <span class="panel-line panel-line-long"></span>
        <span class="panel-line"></span>
        <span class="panel-line panel-line-short"></span>
        <div class="mini-chart">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="data-panel panel-flow">
        <span class="panel-line panel-line-long"></span>
        <span class="panel-line"></span>
        <div class="flow-map">
          <i></i>
          <i></i>
          <i></i>
          <b></b>
          <b></b>
        </div>
      </div>

      <div class="particle-field">
        <span v-for="dot in particles" :key="dot.id" :style="dot.style"></span>
      </div>
    </div>

    <section class="login-copy-card" aria-labelledby="login-copy-title">
      <div class="brand-mark" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="login-copy-heading">
        <h1 id="login-copy-title">设计调度管理系统</h1>
        <p>欢迎登录，请输入账号密码</p>
      </div>

      <form class="login-copy-form" @submit.prevent="handleLogin">
        <label class="form-field">
          <span>账号</span>
          <span class="input-wrap">
            <UserIcon class="field-icon field-icon-left" aria-hidden="true" />
            <input v-model.trim="loginForm.account" type="text" autocomplete="username" placeholder="请输入账号" />
          </span>
        </label>

        <label class="form-field">
          <span>密码</span>
          <span class="input-wrap">
            <Lock class="field-icon field-icon-left" aria-hidden="true" />
            <input
              v-model="loginForm.password"
              :type="passwordVisible ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="请输入密码"
            />
            <button
              class="password-toggle"
              type="button"
              :aria-label="passwordVisible ? '隐藏密码' : '显示密码'"
              :aria-pressed="passwordVisible"
              @click.prevent="passwordVisible = !passwordVisible"
            >
              <Hide v-if="passwordVisible" aria-hidden="true" />
              <View v-else aria-hidden="true" />
            </button>
          </span>
        </label>

        <div class="form-options">
          <label class="remember-password">
            <input v-model="loginForm.remember" type="checkbox" />
            <span>记住密码</span>
          </label>
          <a href="javascript:void(0)">忘记密码</a>
        </div>

        <button class="login-copy-button" type="submit">
          <span>登录</span>
          <i aria-hidden="true">→</i>
        </button>

      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Hide, Lock, User as UserIcon, View } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import type { LoginForm } from '../types/login'

const loginForm = reactive<LoginForm>({
  account: '',
  password: '',
  remember: true
})

const passwordVisible = ref(false)

const particles = Array.from({ length: 72 }, (_, index) => {
  const i = index + 1

  return {
    id: i,
    style: {
      '--x': `${(i * 37) % 100}%`,
      '--y': `${8 + ((i * 19) % 38)}%`,
      '--size': `${2 + (i % 5) * 0.8}px`,
      '--delay': `${i * -0.11}s`,
      '--duration': `${4.8 + (i % 8) * 0.38}s`
    }
  }
})

const handleLogin = () => {
  console.log('login copy submit', {
    account: loginForm.account,
    remember: loginForm.remember
  })
}
</script>

<style scoped lang="scss">
.login-copy-page {
  --copy-blue: #2778f6;
  --copy-blue-deep: #145ee6;
  --copy-cyan: #6ae5f4;
  --copy-ink: #0d1d38;
  --copy-muted: #7c8ba3;
  --copy-line: rgba(138, 180, 235, 0.32);

  position: relative;
  isolation: isolate;
  display: grid;
  min-height: 100vh;
  place-items: center;
  overflow: hidden;
  padding: 32px;
  color: var(--copy-ink);
  background:
    radial-gradient(circle at 8% 10%, rgba(255, 255, 255, 0.92), transparent 28%),
    radial-gradient(circle at 82% 24%, rgba(156, 215, 255, 0.58), transparent 34%),
    radial-gradient(circle at 76% 78%, rgba(105, 224, 240, 0.34), transparent 34%),
    linear-gradient(135deg, #fbfdff 0%, #edf6ff 38%, #dceeff 100%);
}

.login-copy-background {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;

  &::before,
  &::after {
    position: absolute;
    inset: auto -8% -16% -8%;
    height: 44%;
    content: "";
    border-radius: 50% 50% 0 0;
    transform-origin: center bottom;
  }

  &::before {
    background:
      radial-gradient(circle, rgba(255, 255, 255, 0.96) 0 1.4px, transparent 2px) 0 0 / 22px 22px,
      linear-gradient(100deg, rgba(255, 255, 255, 0.76), rgba(115, 198, 255, 0.26), rgba(255, 255, 255, 0.58));
    clip-path: polygon(0 34%, 10% 43%, 20% 38%, 32% 52%, 45% 42%, 58% 56%, 72% 45%, 86% 58%, 100% 49%, 100% 100%, 0 100%);
    opacity: 0.82;
    animation: waveDrift 9s ease-in-out infinite alternate;
  }

  &::after {
    bottom: -21%;
    background:
      radial-gradient(circle, rgba(47, 125, 246, 0.24) 0 1px, transparent 1.8px) 0 0 / 18px 18px,
      linear-gradient(95deg, rgba(117, 220, 255, 0.16), rgba(255, 255, 255, 0.56));
    clip-path: polygon(0 46%, 13% 57%, 28% 48%, 43% 64%, 61% 47%, 78% 61%, 100% 42%, 100% 100%, 0 100%);
    opacity: 0.58;
    animation: waveDriftBack 11s ease-in-out infinite alternate;
  }
}

.light-orb {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  filter: blur(10px);
  opacity: 0.58;
  animation: orbFloat 8s ease-in-out infinite alternate;

  &.orb-a {
    top: 15%;
    right: 8%;
    background: radial-gradient(circle, rgba(83, 218, 243, 0.8), transparent 68%);
  }

  &.orb-b {
    bottom: 4%;
    left: 8%;
    background: radial-gradient(circle, rgba(122, 171, 255, 0.56), transparent 72%);
    animation-delay: -3s;
  }
}

.aurora-ring {
  position: absolute;
  width: 520px;
  height: 520px;
  border: 2px solid transparent;
  border-top-color: rgba(126, 238, 243, 0.58);
  border-right-color: rgba(255, 255, 255, 0.72);
  border-radius: 50%;
  filter: drop-shadow(0 0 18px rgba(98, 216, 245, 0.28));
  opacity: 0.72;
  animation: ringSweep 14s ease-in-out infinite alternate;

  &.ring-a {
    top: -24%;
    right: 16%;
  }

  &.ring-b {
    right: -8%;
    bottom: -20%;
    width: 620px;
    height: 620px;
    border-top-color: rgba(255, 255, 255, 0.64);
    border-left-color: rgba(103, 198, 255, 0.26);
    animation-delay: -6s;
  }
}

.meteor-streak {
  position: absolute;
  width: 220px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.98), rgba(83, 210, 245, 0.68));
  border-radius: 999px;
  filter: blur(0.3px) drop-shadow(0 0 14px rgba(78, 193, 247, 0.58));
  opacity: 0;
  transform: rotate(135deg);
  transform-origin: right center;
  animation: meteorFall 4.6s ease-in-out infinite;

  &::after {
    position: absolute;
    right: -5px;
    top: 50%;
    width: 8px;
    height: 8px;
    content: "";
    background: rgba(255, 255, 255, 0.96);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(98, 221, 255, 0.88);
    transform: translateY(-50%);
  }

  &.meteor-a {
    top: -8%;
    right: 8%;
  }

  &.meteor-b {
    top: -4%;
    right: 32%;
    width: 180px;
    animation-delay: -1.2s;
  }

  &.meteor-c {
    top: 10%;
    right: -8%;
    width: 260px;
    animation-delay: -2.3s;
  }

  &.meteor-d {
    top: 26%;
    right: 16%;
    width: 150px;
    animation-delay: -3.4s;
  }

  &.meteor-e {
    top: 3%;
    right: 58%;
    width: 200px;
    animation-delay: -4s;
  }
}

.pulse-node {
  position: absolute;
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 50%;
  box-shadow:
    0 0 0 8px rgba(118, 209, 255, 0.14),
    0 0 26px rgba(67, 184, 255, 0.72);
  animation: freeNodePulse 2.8s ease-in-out infinite;

  &.node-a {
    top: 23%;
    right: 17%;
  }

  &.node-b {
    right: 32%;
    bottom: 37%;
    animation-delay: -0.9s;
  }

  &.node-c {
    left: 28%;
    bottom: 22%;
    animation-delay: -1.7s;
  }
}

.network-line {
  position: absolute;
  width: 1px;
  height: 520px;
  background: linear-gradient(rgba(113, 171, 235, 0), rgba(113, 171, 235, 0.32), rgba(113, 171, 235, 0));
  transform-origin: top;
  opacity: 0.58;

  &::before,
  &::after {
    position: absolute;
    left: 50%;
    width: 13px;
    height: 13px;
    content: "";
    background: rgba(255, 255, 255, 0.96);
    border-radius: 50%;
    box-shadow: 0 0 18px rgba(82, 190, 255, 0.62);
    transform: translateX(-50%);
    animation: nodePulse 2.6s ease-in-out infinite;
  }

  &::before {
    top: 22%;
  }

  &::after {
    top: 66%;
    animation-delay: -1.1s;
  }

  &.line-a {
    top: 18%;
    left: 13%;
    transform: rotate(-58deg);
  }

  &.line-b {
    top: 32%;
    right: 18%;
    transform: rotate(52deg);
  }

  &.line-c {
    top: 46%;
    right: 8%;
    transform: rotate(-34deg);
  }
}

.data-panel {
  position: absolute;
  width: 272px;
  height: 176px;
  padding: 28px 32px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.46), rgba(214, 241, 255, 0.24));
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 18px;
  box-shadow:
    inset 0 0 24px rgba(255, 255, 255, 0.46),
    0 22px 46px rgba(105, 156, 216, 0.16);
  opacity: 0.62;
  backdrop-filter: blur(12px);
  animation: panelFloat 7s ease-in-out infinite alternate;
}

.panel-chart {
  top: 12%;
  left: 11%;
}

.panel-flow {
  right: 8%;
  bottom: 32%;
  animation-delay: -2.5s;
}

.panel-line {
  display: block;
  width: 54%;
  height: 7px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.64);
  border-radius: 999px;

  &.panel-line-long {
    width: 84%;
  }

  &.panel-line-short {
    width: 34%;
  }
}

.mini-chart {
  position: absolute;
  right: 34px;
  bottom: 26px;
  left: 34px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 64px;

  span {
    width: 18px;
    background: linear-gradient(180deg, rgba(111, 235, 233, 0.72), rgba(255, 255, 255, 0.62));
    border-radius: 8px 8px 2px 2px;
    animation: chartGrow 2.8s ease-in-out infinite alternate;

    &:nth-child(1) {
      height: 28px;
    }

    &:nth-child(2) {
      height: 40px;
      animation-delay: -0.5s;
    }

    &:nth-child(3) {
      height: 34px;
      animation-delay: -1s;
    }

    &:nth-child(4) {
      height: 58px;
      animation-delay: -1.6s;
    }
  }
}

.flow-map {
  position: absolute;
  inset: 70px 42px 34px;

  i {
    position: absolute;
    width: 38px;
    height: 28px;
    border: 2px solid rgba(255, 255, 255, 0.78);
    border-radius: 4px;

    &:nth-child(1) {
      top: 12px;
      left: 0;
    }

    &:nth-child(2) {
      top: -8px;
      left: 78px;
    }

    &:nth-child(3) {
      right: 0;
      bottom: 0;
    }
  }

  b {
    position: absolute;
    height: 2px;
    background: rgba(255, 255, 255, 0.72);
    transform-origin: left center;

    &:nth-of-type(1) {
      top: 22px;
      left: 38px;
      width: 46px;
      transform: rotate(-18deg);
    }

    &:nth-of-type(2) {
      top: 27px;
      left: 116px;
      width: 48px;
      transform: rotate(24deg);
    }
  }
}

.particle-field {
  position: absolute;
  inset: 0;

  span {
    position: absolute;
    left: var(--x);
    bottom: var(--y);
    width: var(--size);
    height: var(--size);
    background: rgba(255, 255, 255, 0.92);
    border-radius: 50%;
    box-shadow: 0 0 14px rgba(65, 176, 255, 0.5);
    animation: particleDrift var(--duration) ease-in-out infinite alternate;
    animation-delay: var(--delay);
  }
}

.login-copy-card {
  position: relative;
  width: min(526px, calc(100vw - 48px));
  padding: 58px 58px 38px;
  text-align: center;
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.92), transparent 34%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(235, 250, 255, 0.44));
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 22px 20px 24px 20px;
  box-shadow:
    inset 0 0 32px rgba(255, 255, 255, 0.74),
    inset 0 -20px 42px rgba(112, 218, 244, 0.12),
    0 34px 86px rgba(73, 122, 186, 0.22),
    0 0 0 10px rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(22px);

  &::before {
    position: absolute;
    inset: 0;
    content: "";
    pointer-events: none;
    border-radius: inherit;
    background: linear-gradient(120deg, transparent 18%, rgba(255, 255, 255, 0.62) 42%, transparent 66%);
    opacity: 0.24;
  }

  &::after {
    position: absolute;
    right: 12%;
    bottom: -34px;
    left: 12%;
    height: 62px;
    content: "";
    pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(65, 165, 255, 0.22), transparent 68%);
    filter: blur(10px);
  }
}

.brand-mark {
  display: grid;
  grid-template-columns: repeat(2, 20px);
  gap: 8px;
  justify-content: center;
  margin-bottom: 34px;

  span {
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #1783ff, #49b5ff);
    border-radius: 6px;
    box-shadow: 0 10px 22px rgba(34, 126, 246, 0.38);

    &:nth-child(2) {
      background: linear-gradient(135deg, #8ec9ff, #5b8ff8);
    }

    &:nth-child(3) {
      background: linear-gradient(135deg, #1a7bf8, #59d7f0);
    }
  }
}

.login-copy-heading {
  h1 {
    margin: 0;
    font-size: 32px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: 0.08em;
  }

  p {
    margin: 16px 0 38px;
    color: var(--copy-muted);
    font-size: 17px;
    letter-spacing: 0.06em;
  }
}

.login-copy-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: left;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 12px;

  > span:first-child {
    color: #17243d;
    font-size: 16px;
    font-weight: 700;
  }
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  height: 56px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(186, 206, 232, 0.72);
  border-radius: 6px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:focus-within {
    border-color: rgba(44, 131, 255, 0.8);
    box-shadow:
      0 0 0 3px rgba(52, 138, 255, 0.12),
      0 8px 24px rgba(41, 127, 246, 0.16);
    transform: translateY(-1px);
  }

  input {
    width: 100%;
    height: 100%;
    padding: 0 42px 0 46px;
    color: #21314d;
    background: transparent;
    border: 0;
    outline: 0;

    &::placeholder {
      color: #9aa8ba;
    }
  }
}

.field-icon,
.password-toggle {
  position: absolute;
  color: #9aa8ba;
}

.field-icon-left {
  left: 18px;
  width: 18px;
  height: 18px;
}

.password-toggle {
  right: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 50%;
  transition:
    color 0.18s ease,
    background-color 0.18s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover,
  &:focus-visible {
    color: var(--copy-blue);
    background: rgba(39, 120, 246, 0.08);
  }
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
  font-size: 16px;

  a {
    color: var(--copy-blue);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.18s ease;

    &:hover {
      color: var(--copy-blue-deep);
    }
  }
}

.remember-password {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #18253c;
  cursor: pointer;
  user-select: none;

  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: var(--copy-blue);
  }
}

.login-copy-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 64px;
  margin-top: 4px;
  overflow: hidden;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.12em;
  cursor: pointer;
  background:
    radial-gradient(circle at 92% 18%, rgba(255, 255, 255, 0.9), transparent 9%),
    linear-gradient(105deg, #1f72f2 0%, #2688ff 58%, #33c8f2 100%);
  border-radius: 7px;
  box-shadow:
    0 18px 34px rgba(39, 120, 246, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.26) inset;
  transition:
    box-shadow 0.2s ease;

  &::before {
    position: absolute;
    inset: 0;
    content: "";
    background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.56) 45%, transparent 64%);
    transform: translateX(-110%);
    animation: buttonSweep 2.6s ease-in-out infinite;
  }

  span,
  i {
    position: relative;
    z-index: 1;
  }

  i {
    position: absolute;
    right: 28px;
    font-style: normal;
    font-size: 30px;
    font-weight: 300;
    animation: arrowNudge 1.8s ease-in-out infinite;
  }

  &:hover {
    box-shadow:
      0 22px 40px rgba(39, 120, 246, 0.36),
      0 0 0 1px rgba(255, 255, 255, 0.38) inset;
  }
}

.permission-tip {
  margin: 4px 0 0;
  color: #7b8da8;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  letter-spacing: 0.05em;
}

@keyframes waveDrift {
  from {
    transform: translate3d(-18px, 0, 0) scaleY(1);
  }
  to {
    transform: translate3d(28px, -18px, 0) scaleY(1.08);
  }
}

@keyframes waveDriftBack {
  from {
    transform: translate3d(22px, 0, 0) scaleY(1);
  }
  to {
    transform: translate3d(-28px, -14px, 0) scaleY(1.06);
  }
}

@keyframes orbFloat {
  from {
    transform: translate3d(-10px, 12px, 0) scale(0.96);
  }
  to {
    transform: translate3d(16px, -18px, 0) scale(1.08);
  }
}

@keyframes ringSweep {
  from {
    transform: rotate(8deg) translate3d(-12px, 0, 0);
  }
  to {
    transform: rotate(24deg) translate3d(20px, 16px, 0);
  }
}

@keyframes meteorFall {
  0%,
  22% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(135deg) scaleX(0.7);
  }
  35% {
    opacity: 0.95;
  }
  62%,
  100% {
    opacity: 0;
    transform: translate3d(-72vw, 72vh, 0) rotate(135deg) scaleX(1.06);
  }
}

@keyframes freeNodePulse {
  0%,
  100% {
    opacity: 0.42;
    transform: scale(0.72);
  }
  45% {
    opacity: 1;
    transform: scale(1.18);
  }
  70% {
    opacity: 0.72;
    transform: scale(0.96);
  }
}

@keyframes nodePulse {
  0%,
  100% {
    opacity: 0.46;
    transform: translateX(-50%) scale(0.82);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.18);
  }
}

@keyframes panelFloat {
  from {
    transform: translate3d(0, 12px, 0);
  }
  to {
    transform: translate3d(0, -14px, 0);
  }
}

@keyframes chartGrow {
  from {
    transform: scaleY(0.82);
  }
  to {
    transform: scaleY(1.04);
  }
}

@keyframes particleDrift {
  from {
    opacity: 0.22;
    transform: translate3d(-22px, 12px, 0) scale(0.76);
  }
  to {
    opacity: 0.98;
    transform: translate3d(26px, -26px, 0) scale(1.12);
  }
}

@keyframes buttonSweep {
  0%,
  44% {
    transform: translateX(-115%);
  }
  72%,
  100% {
    transform: translateX(115%);
  }
}

@keyframes arrowNudge {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

@media (max-width: 980px) {
  .data-panel {
    opacity: 0.32;
    transform: scale(0.86);
  }

  .panel-chart {
    left: -28px;
  }

  .panel-flow {
    right: -32px;
  }
}

@media (max-width: 640px) {
  .login-copy-page {
    padding: 22px;
  }

  .data-panel,
  .network-line {
    display: none;
  }

  .aurora-ring {
    opacity: 0.42;
  }

  .login-copy-card {
    width: min(100%, 420px);
    padding: 42px 24px 30px;
  }

  .brand-mark {
    grid-template-columns: repeat(2, 16px);
    gap: 6px;
    margin-bottom: 26px;

    span {
      width: 16px;
      height: 16px;
    }
  }

  .login-copy-heading {
    h1 {
      font-size: 24px;
    }

    p {
      margin-bottom: 30px;
      font-size: 14px;
    }
  }

  .login-copy-form {
    gap: 18px;
  }

  .form-options,
  .permission-tip {
    font-size: 14px;
  }

  .login-copy-button {
    height: 52px;
    font-size: 18px;
  }
}
</style>
