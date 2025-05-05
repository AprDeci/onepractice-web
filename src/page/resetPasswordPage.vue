<script setup lang="ts">
import { ref } from 'vue';
import { getEmailCaptcha, verifyEmailCaptcha } from '../request/methods/captcha';
import { useRouter } from 'vue-router';
import { useCaptcha, useRequest } from 'alova/client';
import { resetPassword } from '../request/methods/user';
import { useAlert } from '../common/alert';
const router = useRouter();
const { showAlert } = useAlert()

const password = ref("")
const passwordt = ref("")
const email = ref("")
const captcha = ref("")
const verifed = ref(false)


const { loading: sending, countdown, send: sendCaptcha } = useCaptcha(() => getEmailCaptcha(email.value))
const { data: verifydata, loading: verifyLoading, send: verifyCaptcha } = useRequest(() => verifyEmailCaptcha(email.value, captcha.value), {
    immediate: false,
}).onSuccess((res) => {
    showAlert("验证成功!")
    verifed.value = true
}).onError(e => {
    showAlert(e.error, "error")
})
const { data: resetdata, loading: resetLoading, send: sendPassword } = useRequest(() => resetPassword(email.value, password.value), {
    immediate: false,
}).onSuccess((res) => {
    showAlert("修改成功,两秒后自动跳转登录界面!")
    setTimeout(() => {
        messageisout.value = false
        router.push("/login")
    }, 2000)
    // 跳转 弹窗
}).onError((e) => {
    showAlert(e.error, "error")
})
</script>

<template>
    <main class="">
        <div class="absolute left-2 cursor-pointer z-1" @click="router.push('/')">Home</div>
        <div class="partone flex justify-center items-center h-dvh">
            <!-- 登陆 -->
            <div class="login-card card h-auto w-80 lg:w-100 bg-base-100 shadow-xl px-5 py-5 flex flex-col gap-5">
                <div class="card-title">重置密码</div>
                <div class="w-full flex flex-col gap-2">
                    <!-- 验证码界面 -->
                    <fieldset v-if="!verifed" class="fieldset relative">
                        <label class="fieldset-label text-sm">邮箱</label>
                        <input v-model="email" type="email" class="input w-full validator" required
                            placeholder="miku@email.com">
                        <div class="validator-hint">Enter valid email address</div>
                        <label class="fieldset-label text-sm">验证码</label>
                        <div class="join w-full">
                            <input v-model="captcha" type="text" class="input rounded-sm">
                            <button class="btn" @click="sendCaptcha" :loading="sending"
                                :disabled="sending || countdown > 0">
                                {{ sending ? '发送中...' : countdown > 0 ? `${countdown}后可重发` : '发送验证码' }}
                            </button>
                        </div>
                        <div @click="verifyCaptcha" class="btn btn-primary mt-5">确认</div>
                    </fieldset>
                    <!-- 密码界面 -->
                    <fieldset v-if="verifed" class="fieldset">
                        <label class="fieldset-label text-sm">新密码</label>
                        <input type="password " v-model="password" class="input w-full validator" required
                            placeholder="请输入新密码" minlength="6" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z][^\s]{5,}$">
                        <p class="validator-hint hidden">
                            密码至少六位,字母开头包含数字
                        </p>
                        <label class="fieldset-label text-sm">确认密码</label>
                        <input type="password" class="input w-full" :class="{ 'border-error': password != passwordt }"
                            v-model="passwordt" required placeholder="请再次输入新密码">
                        <div class="validator-hint" :class="{ '!visible': password != passwordt }">Two passwords do not
                            match
                        </div>
                        <div class="btn btn-primary" @click="sendPassword">确认</div>
                    </fieldset>
                    <div class="w-full flex flex-col ">
                        <div class="btn" @click="router.push('/login')">返回登录</div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style lang="css" scoped>
.partone {
    background-color: #fafafa;
    opacity: 0.7;
    background-image: linear-gradient(#d0d0d0 7px, transparent 7px), linear-gradient(90deg, #d0d0d0 7px, transparent 7px), linear-gradient(#d0d0d0 3.5px, transparent 3.5px), linear-gradient(90deg, #d0d0d0 3.5px, #fafafa 3.5px);
    background-size: 175px 175px, 175px 175px, 35px 35px, 35px 35px;
    background-position: -7px -7px, -7px -7px, -3.5px -3.5px, -3.5px -3.5px;
}
</style>
