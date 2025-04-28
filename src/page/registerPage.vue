<script setup lang="ts">
import { useRequest } from 'alova/client';
import { ref } from 'vue';
import { getEmailCaptcha } from '../request/methods/captcha';
import { register } from '../request/methods/user';
import { useRouter } from 'vue-router';
import { useAlert } from '../common/alert';

const router = useRouter();

const hasSendEmail = ref(false)
const registerdata = ref({
    username: '',
    password: '',
    email: '',
    captchacode: '',

})

const { data, loading, error, send } = useRequest(email => getEmailCaptcha(email), {
    immediate: false,
},
)



const sendEmail = (): void => {
    hasSendEmail.value = !hasSendEmail.value
    send(registerdata.value.email);
    cooldownchange()
}

const counter = ref(59)
const cooldownchange = () => {
    const interval = setInterval(() => {
        if (counter.value > 0) {
            counter.value--
        }
        if (counter.value === 0) {
            clearInterval(interval)
            hasSendEmail.value = !hasSendEmail.value
            counter.value = 60
        }
    }, 1000)
}

const { showAlert } = useAlert()
const sendregister = async () => {
    try {
        await register(registerdata.value)
        showAlert("注册成功啦!三秒后自动切换登录页面");
        setTimeout(() => {
            router.push('/login')
        }, 3000)
    } catch (error) {
        showAlert(error, "error")
    }


}

</script>

<template>
    <main class="">
        <div class="absolute left-2 cursor-pointer z-1" @click="router.push('/')">Home</div>
        <div class="partone flex justify-center items-center h-dvh">
            <!-- 注册 -->
            <div class="register-card card  w-80 bg-base-100 shadow-xl">
                <div class="card-title mt-6 ml-5">注册</div>
                <div class="card-body pt-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">用户名</legend>
                        <input v-model="registerdata.username" type="text" class="input validator" minlength="3"
                            maxlength="20" placeholder=" " />
                        <p class="validator-hint hidden">
                            用户名至少三位,最长二十位
                        </p>
                    </fieldset>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">邮箱</legend>
                        <label class="input validator">
                            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                                    stroke="currentColor">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input v-model="registerdata.email" type="email" placeholder="mail@site.com" required />
                        </label>
                        <div class="validator-hint hidden">错误邮箱格式</div>
                    </fieldset>
                    <fieldset>
                        <legend class="fieldset-legend">验证码</legend>
                        <div class="join">
                            <input v-model="registerdata.captchacode" type="text"
                                class="input  rounded-sm join-item w-40 lg:w-56" placeholder="Type here" />
                            <button class="btn join-item btn-primary" @click="sendEmail" :disabled="hasSendEmail">
                                <span v-if="!hasSendEmail && !loading">发送验证码</span>
                                <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                                <span v-if="hasSendEmail" class="countdown">
                                    <span id="cooldown" :style="{ '--value': counter }" aria-live="polite"
                                        aria-label="59">59</span>
                                </span>
                            </button>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class=" fieldset-legend">密码</legend>
                        <label class="input validator">
                            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                                    stroke="currentColor">
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z">
                                    </path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input v-model="registerdata.password" class="" type="password" required
                                placeholder="Password" minlength="6"
                                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z][^\s]{5,}$" />
                        </label>
                        <p class="validator-hint hidden">
                            密码至少六位,字母开头包含数字
                        </p>
                    </fieldset>
                    <button class="btn btn-primary btn-md mt-2" @click="sendregister">注册</button>
                    <button class="btn btn-ghost" @click="router.push({ name: 'login' })">切换为登陆</button>
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
