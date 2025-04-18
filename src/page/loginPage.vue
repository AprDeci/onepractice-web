<script setup lang="ts">
import { useRequest } from 'alova/client';
import { ref } from 'vue';
import { getEmailCaptcha } from '../request/methods/captcha';
import { register, login } from '../request/methods/user';
import { getallpaper } from '../request/methods/paper';
import { motion, AnimatePresence } from "motion-v"
import { useRouter } from 'vue-router';

const router = useRouter();
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

const loginData = ref({
    usernameOrEmail: '',
    password: ''
})
const sendlogin = async () => {
    try {
        await getallpaper();
        let data = await login(loginData.value.usernameOrEmail, loginData.value.password)
        goodmessage.value = true
        message.value = "登录成功啦!五秒后自动跳转首页"
        messageisout.value = true
        setTimeout(() => {
            router.push("/")
        }, 5000)
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
        <div class="absolute left-2 cursor-pointer z-1" @click="router.push('/')">Home</div>
        <div class="partone flex justify-center items-center h-dvh flex-col">
            <!-- 消息弹窗 -->
            <AnimatePresence>
                <motion.div v-if="messageisout" class="absolute top-20 lg:right-20" :initial="{ opacity: 0, scale: 0 }"
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
            <!-- 登陆 -->
            <div class="login-card card h-auto w-80  bg-base-100 shadow-xl">
                <div class="card-title mt-6 ml-5">登陆</div>
                <!-- name of each tab group should be unique -->
                <div class="tabs tabs-border">
                    <input type="radio" name="my_tabs_2" class="tab" aria-label="账号登录" checked="true" />
                    <div class="tab-content">
                        <div class="card-body pt-2 flex flex-col gap-0">
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">用户名</legend>
                                <input v-model="loginData.usernameOrEmail" type="text" class="input validator"
                                    minlength="3" maxlength="20" placeholder=" " />
                                <p class="validator-hint">
                                    用户名至少三位,最长二十位
                                </p>
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
                                        placeholder="Password" minlength="6"
                                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z][^\s]{5,}$" />
                                </label>
                                <p class="validator-hint ">
                                    密码至少六位,字母开头包含数字
                                </p>

                            </fieldset>
                            <div class="text-gray-500 hover:text-gray-800 cursor-pointer " @click="router.push({
                                name: 'resetPassword'
                            })">忘记密码?</div>
                            <button class="btn btn-primary btn-md mt-2" @click=sendlogin>登陆</button>
                            <button class="btn btn-ghost" @click="router.push({ name: 'register' })">切换为注册</button>
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
