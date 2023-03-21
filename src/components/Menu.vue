<script setup lang="ts">
const { t } = useI18n()
const isCollapse = ref(false) // 控制menu的展开和收缩
if (window.innerWidth <= 1200)
  isCollapse.value = true

const route = useRoute()
const state = reactive({ // 设置当前菜单的默认选中
  path: `/${route.fullPath.split('/')[1]}`,
})

let router = useRouter()
// 监听当前路由变化
watch(() => router.currentRoute.value, (e) => {
  state.path = '/'+e.fullPath.split('/')[1]
  console.log(state.path)
});

</script>

<template>
  <el-aside :width="isCollapse ? 'auto' : '400px'" style="background-color: rgb(238, 241, 246)">
    <el-scrollbar height="calc(100vh - 60px)">
      <div class="v-menu" i-carbon:menu @click="isCollapse = !isCollapse" />
      <el-menu
        router
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        :default-active="state.path"
        text-color="#fff"
      >
        <el-menu-item index="/DataSubmissionService">
          <el-icon i-carbon:bare-metal-server-02 />
          <span>{{ t('menu.DataSubmissionService') }}</span>
        </el-menu-item>
        <el-menu-item index="/CreditDataCorrection">
          <el-icon i-carbon:infrastructure-classic />
          <span>{{ t('menu.CreditDataCorrection') }}</span>
        </el-menu-item>
        <el-menu-item index="/CreditReportEnquiryService">
          <el-icon i-carbon:search-locate />
          <span>{{ t('menu.CreditReportEnquiryService') }}</span>
        </el-menu-item>
        <el-menu-item index="/PMDS">
          <el-icon i-carbon:build-tool />
          <span>{{ t('menu.PMDS') }}</span>
        </el-menu-item>
        <el-menu-item index="/HistoricalDataFileListing">
          <el-icon i-carbon:align-box-top-left />
          <span>{{ t('menu.HistoricalDataFileListing') }}</span>
        </el-menu-item>
        <el-menu-item index="/NotificationService">
          <el-icon i-carbon:notification />
          <span>{{ t('menu.NotificationService') }}</span>
        </el-menu-item>
        <el-menu-item index="/KeyManagementService">
          <el-icon i-carbon:document-signed />
          <span>{{ t('menu.KeyManagementService') }}</span>
        </el-menu-item>
        <el-menu-item index="/SystemReportingService">
          <el-icon i-carbon:image-reference />
          <span>{{ t('menu.SystemReportingService') }}</span>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <el-icon i-carbon:model-alt />
            <span>{{ t('menu.UserAccountManagement') }}</span>
          </template>
          <el-menu-item index="/UserAccountManagement/AccountManagementService">
            <template #title>
              <span>{{ t('menu.AccountManagementService') }}</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/UserAccountManagement/ChangeUsersPassword">
            <template #title>
              <span>{{ t('menu.ChangeUserPassword') }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/OtherService">
          <el-icon i-carbon:align-box-top-right />
          <span>{{ t('menu.OtherService') }}</span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>
