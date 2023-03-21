<script setup lang="ts">
const props = defineProps<{ id: string }>()
console.log(props)
const name = ref('123e4567-e89b-12d3-a456-556642440000')
const se = ref('Option2')

const router = useRouter()
const back = () => {
  console.log(router)
  router.back()
}

const params = reactive({
  messageType: 'a',
  messageId: 'b',
  messageContent: 'ccccc',
})
</script>

<template>
  <div class="data-correction">
    <h1>Message detail</h1>
    <div class="btn-content" mt-6>
      <el-button color="#626aef" :dark="isDark" @click="back">
        Back
      </el-button>
    </div>
    <div class="item">
      <div class="title">
        Message Type：
      </div>
      <div class="content">
        <el-input v-model="params.messageType" class="w-64 mr-3" placeholder="Transaction ID" />
      </div>
    </div>
    <div class="item">
      <div class="title">
        Message ID：
      </div>
      <div class="content">
        <el-input v-model="params.messageId" class="w-64 mr-3" placeholder="Transaction ID" />
      </div>
    </div>
    <div class="item">
      <div class="title">
        Decrypted Content：
      </div>
      <div class="content">
        <el-input
          v-model="params.messageContent"
          :rows="3"
          type="textarea"
          placeholder="Please input"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h1{
  font-size: 30px;
}
fieldset {
    padding: .35em .625em .75em;
    margin: 0 2px;
    border: 1px solid silver;
}

legend {
    padding: .5em;
    border: 0;
    width: auto;
}
.data-correction{
  .btn-content{
    display:flex;
    justify-content: space-between;
  }
}
.data-correction{
  padding:15px;
  border:solid rgb(228,231,227) 1px;
  .item{
    display:flex;
    flex-flow:row nowrap;
    margin-top:15px;
    .title{
      width:200px;
      flex:none;
      text-align:right;
    }
    .content{
      flex:auto;
    }
  }
}
</style>
