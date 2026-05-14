<template>
  <el-container class="layout-container" :class="{ 'is-mobile': isMobile }">
    <el-aside
      v-if="!isMobile"
      :width="isCollapse ? '64px' : '200px'"
      class="aside"
    >
      <div class="logo" v-if="isShowHeader">
        {{ isCollapse ? "系统" : "交互练习系统" }}
      </div>
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
        :collapse="isCollapse"
        :unique-opened="true"
      >
        <template v-for="item in menuRoutes" :key="item.path">
          <el-sub-menu
            v-if="item.children && item.children.length > 0"
            :index="resolvePath(item.path)"
          >
            <template #title>
              <el-icon><Menu /></el-icon>
              <span>{{ item.meta?.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="resolvePath(item.path, child.path)"
            >
              <el-icon><Document /></el-icon>
              <span>{{ child.meta?.title }}</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item v-else :index="resolvePath(item.path)">
            <el-icon><Menu /></el-icon>
            <span>{{ item.meta?.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container class="content-wrapper">
      <el-header class="header" v-if="isShowHeader">
        <div class="header-left">
          <el-icon
            v-if="!isMobile"
            class="collapse-icon"
            @click="toggleCollapse"
          >
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <span v-else class="mobile-header-title">{{
            route.meta?.title
          }}</span>
        </div>

        <div class="header-right">
          <span class="user-name">{{ userStore.userInfo.username }}</span>
          <el-button
            v-if="!isMobile"
            type="danger"
            size="small"
            @click="handleLogout"
            >退出登录</el-button
          >
        </div>
      </el-header>

      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <div v-if="isMobile" class="mobile-bottom-bar">
        <div
          v-for="item in mobileNavList"
          :key="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
          @click="router.push(item.path)"
        >
          <el-icon>
            <ChatDotRound v-if="item.icon === 'socket'" />
            <ChatLineSquare v-else-if="item.icon === 'room'" />
            <User v-else />
          </el-icon>
          <span class="nav-text">{{ item.title }}</span>
        </div>

        <div class="nav-item logout" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          <span class="nav-text">退出</span>
        </div>
      </div>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import {
  ChatDotRound,
  ChatLineSquare,
  Document,
  Expand,
  Fold,
  Menu,
  SwitchButton,
  User,
} from "@element-plus/icons-vue";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const isShowHeader = ref(true);

onMounted(() => {
  isShowHeader.value = qiankunWindow.__POWERED_BY_QIANKUN__ ? false : true;
});

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const isCollapse = ref(false);
const isMobile = ref(false);

// --- 路径处理逻辑 ---
// 拼接父子路径，确保 el-menu 能够正确跳转
const resolvePath = (parentPath: string, childPath?: string) => {
  if (!childPath) return `/${parentPath}`;
  return `/${parentPath}/${childPath}`;
};

// --- 移动端适配 ---
const checkScreen = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkScreen();
  window.addEventListener("resize", checkScreen);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreen);
});

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const handleLogout = () => {
  userStore.clearUserInfo();
  router.push("/login");
};

// --- 路由过滤 ---
// PC端：获取根路由下的所有直接子路由
const menuRoutes = computed(() => {
  const root = router.options.routes.find((r) => r.path === "/");
  return root?.children || [];
});

// 移动端：手动定义需要展示的聊天菜单及其图标
const mobileNavList = [
  { path: "/nodejs/socket", title: "公共群聊", icon: "socket" },
  { path: "/nodejs/room", title: "群聊", icon: "room" },
  { path: "/nodejs/user", title: "私聊", icon: "user" },
];
</script>

<style scoped>
.layout-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  min-height: 0;
  display: flex;
}

/* ===== 侧边栏 ===== */
.aside {
  background: linear-gradient(180deg, #1d2b3c 0%, #253549 100%);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* ===== Header ===== */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  flex-shrink: 0;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.2s;
  padding: 4px;
  border-radius: 4px;
}

.collapse-icon:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.08);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

/* ===== Main Content ===== */
.main {
  background-color: #f0f2f5;
  padding: 20px;
  position: relative;
  overflow-y: auto;
  min-height: 0;
}

.is-mobile .main {
  padding: 10px;
  padding-bottom: 70px;
}

.mobile-header-title {
  font-weight: 700;
  font-size: 17px;
  color: #1a1a2e;
}

/* ===== Mobile Bottom Bar ===== */
.mobile-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #ffffff;
  border-top: 1px solid #ebeef5;
  display: flex;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  cursor: pointer;
  transition: color 0.2s;
  position: relative;
}

.nav-item .el-icon {
  font-size: 22px;
  margin-bottom: 2px;
  transition: color 0.2s;
}

.nav-text {
  font-size: 11px;
}

.nav-item.active {
  color: #409eff;
}

.nav-item.active::before {
  content: "";
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: #409eff;
  border-radius: 0 0 2px 2px;
}

.nav-item.logout {
  color: #f56c6c;
}

/* ===== Transitions ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Layout Structure ===== */
.content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.el-menu-vertical {
  flex: 1;
  overflow-y: auto;
  border-right: none;
}
</style>
