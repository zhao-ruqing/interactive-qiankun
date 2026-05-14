<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">用户登录</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        class="login-form"
        label-position="top"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
            autocomplete="username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
            autocomplete="current-password"
          />
        </el-form-item>
        <el-form-item class="button-group">
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="loading"
            class="login-button"
            size="large"
          >
            登录
          </el-button>
          <el-button
            type="primary"
            class="login-button"
            plain
            @click="handleRegister"
            :loading="loading"
            size="large"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserInfoAPI, loginAPI, registerAPI } from "@/api/user";
import { useUserStore } from "@/store/user";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

// 实例化
const userStore = useUserStore();
const router = useRouter();
const loginFormRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
});

const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
});

// 登录：使用 async/await 优化异步逻辑
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    const valid = await loginFormRef.value.validate();
    if (!valid) return;

    loading.value = true;
    const res = await loginAPI(loginForm);

    if (res.status === 0) {
      // 存储 Token
      userStore.setToken(res.token);

      // 确保用户信息获取成功后再跳转
      const userInfo = await getUserInfoAPI();
      userStore.setUserInfo(userInfo.data);

      ElMessage.success("登录成功！");
      router.push("/");
    } else {
      ElMessage.error(res.msg || "登录失败");
    }
  } catch (error) {
    console.error("表单校验失败或接口报错", error);
  } finally {
    loading.value = false;
  }
};

// 注册
const handleRegister = async () => {
  if (!loginFormRef.value) return;

  try {
    const valid = await loginFormRef.value.validate();
    if (!valid) return;

    loading.value = true;
    const res = await registerAPI(loginForm);

    if (res.status === 0) {
      ElMessage.success("注册成功！");
    } else {
      ElMessage.error(res.msg || "注册失败");
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 30% 60%, rgba(64, 158, 255, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(100, 120, 255, 0.04) 0%, transparent 50%),
    linear-gradient(180deg, #f0f2f5 0%, #e8ecf1 100%);
  padding: 20px;
  box-sizing: border-box;
}

.login-box {
  width: 100%;
  max-width: 420px;
  padding: 48px 36px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 16px 40px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.02),
      0 12px 32px rgba(0, 0, 0, 0.08),
      0 20px 48px rgba(0, 0, 0, 0.04);
  }
}

.login-title {
  text-align: center;
  margin: 0 0 40px;
  font-size: 26px;
  color: #1a1a2e;
  font-weight: 700;
  letter-spacing: 1px;

  &::after {
    content: "";
    display: block;
    width: 44px;
    height: 3px;
    background: linear-gradient(90deg, #409eff, #66b1ff);
    margin: 14px auto 0;
    border-radius: 3px;
  }
}

.login-form {
  :deep(.el-input__wrapper) {
    padding: 10px 14px;
    border-radius: 10px;
    box-shadow: none;
    background: #f8f9fb;
    border: 1px solid #ebeef5;
    transition: all 0.25s ease;

    &:hover {
      border-color: #c0c4cc;
      background: #f5f6f9;
    }
  }

  :deep(.el-input__wrapper.is-focus) {
    border-color: #409eff;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.08);
  }

  :deep(.el-input__inner) {
    font-size: 15px;
    color: #303133;
  }

  .el-form-item {
    margin-bottom: 24px;
  }

  .button-group {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 14px;

    :deep(.el-form-item__content) {
      margin-left: 0 !important;
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }

  .login-button {
    width: 100%;
    height: 50px;
    font-size: 16px;
    border-radius: 10px;
    margin-left: 0 !important;
    font-weight: 600;
    transition: all 0.25s ease;

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@media (max-width: 576px) {
  .login-container {
    background: #ffffff;
    align-items: flex-start;
    padding-top: 60px;
  }

  .login-box {
    box-shadow: none;
    padding: 0 24px;
    border: none;
  }

  .login-title {
    font-size: 24px;
    margin-bottom: 32px;
  }

  .login-button {
    height: 48px;
  }
}
</style>
