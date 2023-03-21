<script setup lang="ts">
import { userInfo,outLogin } from '@/api'
const route = useRoute()
const router = useRouter()
const state = reactive({
  path:route.fullPath.split("/")[1],
  info:{}
})
const signOut=()=>{
  outLogin().then(()=>{
    localStorage.removeItem('token');
    router.push(`/login`)
  })
}

onMounted(()=>{
  userInfo().then((res) => {
    console.log(res)
    state.info=res.data
    console.log(res.data)
  }).catch((err)=>{
    console.log(err)
  })
})

</script>

<template>
  <div style="flex:1">
    <h3 class="name">ABC Bank Account</h3> 
  </div>
  <div style="flex:2">
    <h1 class="title">Credit Reference Platform Access Portal,CRP</h1>
  </div>
  <div style="flex:1" class="user">
    <span class="title">Welcome,user</span>
    <el-button
      class="userinfo"
      link
      >
        <el-icon i-carbon:user-avatar-filled/>
    </el-button>
    <el-button
      class="signout"
      type="danger"
      link
      @click="signOut"
      >
        <el-icon i-carbon:logout/>
    </el-button>
    <LanguageButton />
  </div>
</template>

<style scoped lang="scss">
.name{
  font-size: 18px;
  font-weight: bold;
}
.title{
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
.user{
  width: 200px;
  height: 60px;
  display: flex;
  justify-content: end;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  background-image: radial-gradient(transparent 1px,var(--bg-color) 1px);
  .title{
    font-size: 18px;
    font-weight: bold;
  }
  .userinfo{
    font-size: 18px;
  }
  .signout{
    font-size: 18px;
  }
}
</style>