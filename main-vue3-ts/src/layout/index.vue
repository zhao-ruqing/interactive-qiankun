<template>
  <div class="layout-container">
    <div class="main-content">
      <header class="header">
        <div class="logo-main">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">Qiankun Main</span>
        </div>
        <nav class="menu">
          <router-link
            v-for="route in menuRoutes"
            :key="route.path"
            :to="route.path"
            class="menu-item"
            :class="{ active: isActiveRoute(route) }"
          >
            <span class="menu-item-dot"></span>
            {{ route.meta?.title }}
          </router-link>
        </nav>
        <div class="user-section">
          <div class="user-info">
            <el-avatar :size="36" class="user-avatar">
              {{ userStore.userInfo?.username?.charAt(0).toUpperCase() || "U" }}
            </el-avatar>
            <span class="username">{{
              userStore.userInfo?.username || "用户"
            }}</span>
          </div>
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="dropdown-trigger">
              <el-icon :size="16"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <div class="content-wrapper">
        <div v-if="$route.path !== '/'" class="micro-app-view">
          <div class="micro-app-header">
            <span class="micro-app-badge">子应用</span>
          </div>
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
        <div v-else class="welcome-page">
          <div class="welcome-hero">
            <div class="welcome-icon">🏠</div>
            <h1>欢迎来到主应用</h1>
            <p class="welcome-desc">基于 Vue3 + TypeScript + Qiankun 的微前端示例项目，帮助你快速理解微前端架构的核心概念与实践。</p>
          </div>
          <div class="app-cards">
            <div class="card" @click="$router.push('/son01-vue3-ts')">
              <div class="card-icon">🟢</div>
              <h3>Vue3 子应用</h3>
              <p>基于 Vue3 + Element Plus + TypeScript 构建的交互式聊天应用</p>
              <span class="card-link">立即体验 →</span>
            </div>
            <div class="card" @click="$router.push('/son02-react-ts')">
              <div class="card-icon">🔵</div>
              <h3>React 子应用</h3>
              <p>基于 React + Ant Design + TypeScript 构建的 AI 智能管理平台</p>
              <span class="card-link">立即体验 →</span>
            </div>
          </div>
          <div class="welcome-features">
            <div class="feature-item">
              <span class="feature-dot"></span>
              <span>微前端架构</span>
            </div>
            <div class="feature-item">
              <span class="feature-dot"></span>
              <span>独立部署</span>
            </div>
            <div class="feature-item">
              <span class="feature-dot"></span>
              <span>技术栈无关</span>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer">
        <span>Qiankun Micro Frontend &copy; {{ currentYear }}</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, Setting, SwitchButton, User } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { routes } from "../router/index";
import { useUserStore } from "../store/user";

const $route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const currentYear = new Date().getFullYear();

// 获取所有带有菜单标识的路由
const menuRoutes = computed(() => {
  // 从路由配置中找到 Layout 的子路由
  const layoutRoute = routes.find((route: any) => route.path === "/");

  if (layoutRoute && layoutRoute.children) {
    return layoutRoute.children
      .filter((child: any) => child.meta?.isMenu)
      .map((child: any) => {
        // 将相对路径转换为绝对路径
        let fullPath = child.path === "" ? "/" : `/${child.path.split("/")[0]}`;

        return {
          ...child,
          path: fullPath,
          // 保存原始路径用于判断
          originalPath: child.path,
        };
      });
  }

  return [];
});

// 判断当前路由是否激活
const isActiveRoute = (route: any) => {
  const routePath = route.path; // 已经转换后的绝对路径
  const originalPath = route.originalPath || route.path; // 原始路径

  if (routePath === "/") {
    // 首页特殊处理，精确匹配根路径
    return $route.path === "/";
  } else if (originalPath.includes(":pathMatch")) {
    // 对于包含通配符的子应用路由，使用前缀匹配
    return $route.path.startsWith(routePath + "/") || $route.path === routePath;
  } else {
    // 其他路由精确匹配
    return $route.path === routePath;
  }
};

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case "profile":
      ElMessage.info("个人信息功能待实现");
      break;
    case "settings":
      ElMessage.info("设置功能待实现");
      break;
    case "logout":
      handleLogout();
      break;
  }
};

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 清空用户信息
      userStore.clearUserInfo();
      ElMessage.success("退出登录成功");
      // 跳转到登录页
      router.push("/login");
    })
    .catch(() => {
      // 取消操作
    });
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  background: #f0f2f5;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* ===== Header ===== */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 28px;
  background: #ffffff;
  border-bottom: 1px solid #ebeef5;
  z-index: 100;
  flex-shrink: 0;
}

.logo-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 22px;
  line-height: 1;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ===== Navigation ===== */
.menu {
  display: flex;
  gap: 4px;
  margin-left: auto;
  margin-right: 28px;
}

.menu-item {
  position: relative;
  padding: 8px 18px;
  color: #606266;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c0c4cc;
  transition: all 0.25s ease;
}

.menu-item:hover {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.06);
}

.menu-item:hover .menu-item-dot {
  background: #1890ff;
}

.menu-item.active {
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
  font-weight: 600;
}

.menu-item.active .menu-item-dot {
  background: #1890ff;
  box-shadow: 0 0 6px rgba(24, 144, 255, 0.4);
}

/* ===== User Section ===== */
.user-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border-radius: 40px;
  background: #f5f7fa;
  transition: background 0.2s;
}

.user-section:hover {
  background: #ebeef5;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  flex-shrink: 0;
}

.username {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  color: #909399;
  transition: all 0.2s;
}

.dropdown-trigger:hover {
  background: #dcdfe6;
  color: #303133;
}

/* ===== Content Area ===== */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  padding: 16px;
}

.micro-app-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.04);
}

.micro-app-header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #fafbfc;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.micro-app-badge {
  font-size: 12px;
  color: #1890ff;
  background: rgba(24, 144, 255, 0.08);
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: 500;
}

.micro-app-view > .fade-enter-active,
.micro-app-view > .fade-leave-active {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ===== Welcome Page ===== */
.welcome-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 60px 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.04);
}

.welcome-hero {
  text-align: center;
  margin-bottom: 48px;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
  line-height: 1;
}

.welcome-hero h1 {
  font-size: 32px;
  color: #1a1a2e;
  margin: 0 0 16px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.welcome-desc {
  color: #909399;
  font-size: 15px;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ===== App Cards ===== */
.app-cards {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.card {
  width: 300px;
  padding: 36px 28px;
  background: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #ebeef5;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover::before {
  transform: scaleX(1);
}

.card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 8px 24px rgba(24, 144, 255, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.04);
  border-color: #b3d8ff;
}

.card-icon {
  font-size: 36px;
  margin-bottom: 16px;
  line-height: 1;
}

.card h3 {
  margin: 0 0 10px;
  color: #1a1a2e;
  font-size: 18px;
  font-weight: 600;
}

.card p {
  color: #909399;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px;
}

.card-link {
  font-size: 13px;
  color: #1890ff;
  font-weight: 500;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.25s ease;
  display: inline-block;
}

.card:hover .card-link {
  opacity: 1;
  transform: translateX(0);
}

/* ===== Features ===== */
.welcome-features {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.feature-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b3d8ff;
}

/* ===== Footer ===== */
.footer {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
  color: #909399;
  border-top: 1px solid #ebeef5;
  background: #ffffff;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .logo-main {
    font-size: 14px;
  }

  .menu {
    gap: 2px;
    margin-right: 12px;
  }

  .menu-item {
    padding: 6px 10px;
    font-size: 12px;
  }

  .user-info {
    gap: 6px;
  }

  .username {
    display: none;
  }

  .content-wrapper {
    padding: 8px;
  }

  .welcome-page {
    padding: 32px 16px;
  }

  .welcome-hero h1 {
    font-size: 24px;
  }

  .app-cards {
    flex-direction: column;
    align-items: center;
  }

  .card {
    width: 100%;
    max-width: 340px;
  }
}

/* ===== Transitions ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
