<script setup lang="ts">
import { useRequest } from 'alova/client';
import { ref } from 'vue';
import { getEmailCaptcha } from '../request/methods/captcha';
import { register, login } from '../request/methods/user';
import { motion, AnimatePresence } from "motion-v"

const islogin = ref(false)
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

const message = ref('')
const messageisout = ref(false)
const goodmessage = ref(false)
const sendregister = async () => {
    try {
        let data = await register(registerdata.value)
        goodmessage.value = true
        message.value = "注册成功啦!五秒后自动切换登录页面"
        messageisout.value = true
        setTimeout(() => {
            messageisout.value = false
            islogin.value = true;
        }, 5000)
    } catch (error) {
        goodmessage.value = false
        message.value = error
        messageisout.value = true
        setTimeout(() => {
            messageisout.value = false
        }, 5000)
    }


}
const loginData = ref({
    usernameOrEmail: '',
    password: ''
})
const sendlogin = async () => {
    try {
        let data = await login(loginData.value.usernameOrEmail, loginData.value.password)
        goodmessage.value = true
        message.value = "登录成功啦!五秒后自动跳转首页"
        messageisout.value = true
    } catch (error) {
        goodmessage.value = false
        message.value = error
        messageisout.value = true
    }
    setTimeout(() => {
        messageisout.value = false
    }, 5000)
}
</script>

<template>
    <main class="">
        <div class="partone flex justify-center items-center h-dvh">
            <!-- 消息弹窗 -->
            <AnimatePresence>
                <motion.div v-if="messageisout" class="fixed top-20 right-20" :initial="{ opacity: 0, scale: 0 }"
                    :exit="{ opacity: 0, scale: 0 }" :animate="{ opacity: 1, scale: 1 }" :transition="{
                        duration: 0.4,
                        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 }
                    }">
                    <div role="alert" class=" alert" :class="[goodmessage ? 'alert-success' : 'alert-error']">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                            {{ message }}
                        </span>
                    </div>
                </motion.div>
            </AnimatePresence>
            <!-- 注册 -->
            <div class="register-card card h-auto w-80 bg-base-100 shadow-xl" v-if="!islogin">
                <div class="card-title mt-6 ml-5">注册</div>
                <div class="card-body pt-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">用户名</legend>
                        <input v-model="registerdata.username" type="text" class="input" placeholder=" " />
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
                        <div class="validator-hint hidden">Enter valid email address</div>
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
                                placeholder="Password" minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
                        </label>
                        <p class="validator-hint hidden">
                            必须大于八个字符,包括数字,小写字母,大写字母
                        </p>
                    </fieldset>
                    <button class="btn btn-primary btn-md mt-2" @click="sendregister">注册</button>
                    <button class="btn btn-ghost" @click="islogin = !islogin">切换为登陆</button>
                </div>
            </div>
            <!-- 登陆 -->
            <div class="login-card card h-auto w-80 bg-base-100 shadow-xl" v-if="islogin">
                <div class="card-title mt-6 ml-5">登陆</div>
                <!-- name of each tab group should be unique -->
                <div class="tabs tabs-border">
                    <input type="radio" name="my_tabs_2" class="tab" aria-label="账号登录" checked="true" />
                    <div class="tab-content">
                        <div class="card-body pt-2">
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">用户名</legend>
                                <input v-model="loginData.usernameOrEmail" type="text" class="input" placeholder=" " />
                            </fieldset>
                            <fieldset>
                                <legend class="fieldset-legend">密码</legend>
                                <label class="input validator">
                                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                                            stroke="currentColor">
                                            <path
                                                d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z">
                                            </path>
                                            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                        </g>
                                    </svg>
                                    <input v-model="loginData.password" class="" type="password" required
                                        placeholder="Password" minlength="8"
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
                                </label>
                                <p class="validator-hint hidden">
                                    必须大于八个字符,包括数字,小写字母,大写字母
                                </p>
                            </fieldset>
                            <button class="btn btn-primary btn-md mt-2" @click=sendlogin>登陆</button>
                            <button class="btn btn-ghost" @click="islogin = !islogin">切换为注册</button>
                        </div>
                    </div>
                    <input type="radio" name="my_tabs_2" class="tab" aria-label="邮箱登录" />
                    <div class="tab-content">
                        <div class="card-body pt-2">
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">邮箱</legend>
                                <label class="input validator">
                                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                                            stroke="currentColor">
                                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                        </g>
                                    </svg>
                                    <input type="email" placeholder="mail@site.com" required />
                                </label>
                                <div class="validator-hint hidden">Enter valid email address</div>
                            </fieldset>
                            <fieldset>
                                <legend class="fieldset-legend">密码</legend>
                                <label class="input validator">
                                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                                            stroke="currentColor">
                                            <path
                                                d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z">
                                            </path>
                                            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                        </g>
                                    </svg>
                                    <input class="" type="password" required placeholder="Password" minlength="8"
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
                                </label>
                                <p class="validator-hint hidden">
                                    必须大于八个字符,包括数字,小写字母,大写字母
                                </p>
                            </fieldset>
                            <button class="btn btn-primary btn-md mt-2" @click=sendlogin>登陆</button>
                            <button class="btn btn-ghost" @click="islogin = !islogin">切换为注册</button>
                        </div>
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
