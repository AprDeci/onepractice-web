<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../request/methods/user';
import { useRouter } from 'vue-router';
import { useAlert } from '../common/alert';
import loginBg from '@/components/login/bg.vue';
const router = useRouter();

const loginData = ref({
    usernameOrEmail: '',
    password: ''
})

const { showAlert } = useAlert()

const sendlogin = async (recaptchatoken: string) => {
    try {
        await login(loginData.value.usernameOrEmail, loginData.value.password, recaptchatoken)
        showAlert("登录成功啦!三秒后自动跳转首页")
        setTimeout(() => {
            router.push("/")
        }, 3000)
    } catch (error) {
        showAlert(error, "error")
    }
}

// recaptcha
function recaptcha(e) {
    e.preventDefault();
    grecaptcha.ready(function () {
        grecaptcha.execute('6Le-fiwrAAAAANI2DM0GRqdHRQDLWUQOSJtQ9Ere', { action: 'submit' }).then(function (token) {
            sendlogin(token)
        });
    });
}
</script>

<template>
    <loginBg>

        <div class=" h-auto w-100 space-y-5">
            <div class="cursor-pointer" @click="router.push('/')">
                <span class="font-bold text-2xl text-cyan-900">
                    One Practice
                </span>
            </div>
            <div class="login-card card bg-base-100 shadow-xl">
                <div class="card-title mt-6 ml-5">登陆</div>
                <!-- name of each tab group should be unique -->
                <div class="tabs tabs-border">
                    <input type="radio" name="my_tabs_2" class="tab" aria-label="账号登录" checked="true" />
                    <div class="tab-content">
                        <div class="card-body pt-2 flex flex-col gap-0">
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">用户名或邮箱</legend>
                                <input v-model="loginData.usernameOrEmail" type="text" class="input w-full validator"
                                    minlength="3" maxlength="20" placeholder=" " />
                                <p class="validator-hint">
                                    用户名至少三位,最长二十位
                                </p>
                            </fieldset>
                            <fieldset>
                                <legend class="fieldset-legend">密码</legend>
                                <label class="input w-full validator">
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
                            <button class="btn btn-primary btn-md mt-2" @click=recaptcha>登陆</button>
                            <button class="btn btn-ghost mt-2" @click="router.push({ name: 'register' })">切换为注册</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </loginBg>
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
