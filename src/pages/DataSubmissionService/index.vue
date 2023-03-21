<script setup lang="ts">
// import { queryGet } from '../api'
//
import { dataSubmissionListUpload } from '@/api'
const tableData = [
  {
    transactionID: 'TR2100001',
    remarks: '',
    subject: 'Kenny Chans request',
    uploadedBy: 'Barbara Lockman',
    uploadDatetime: '2021/06/12 09:36:51',
    approvedBy: 'Andrew Jenkins',
    approveDatetime: '2021/06/13 15:30:08',
    status: 'CRP Responded-I',
  },
]

const currentPage2 = ref(5)
const pageSize2 = ref(100)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const router = useRouter()
// const toDetail = (item) => {
//   console.log(item)
//   router.push(`/CreditData/${item.row.transactionID}`)
// }
const onUpload = () => {
  router.push('/DataSubmissionService/upload')
}
const params = reactive({
  filterQueryObj: { // params.filterQueryObj
    startTime: '',
    endTime: '',
    fileType: '1',
    fileName: '',
  },
  fileTypeList: [ // params.fileTypeList
    {
      value: '1',
      label: 'Data File Upload',
    },
    {
      value: '2',
      label: 'Data File Upload Response',
    },
    {
      value: '3',
      label: 'Data File Processing Result Notification',
    },
  ],
  tableData: [ // params.tableData
    // {
    //   msgId: '00000011122221',
    //   remark: '陳小明',
    //   createdBy: 'ty',
    //   createdTime: '2021/06/12 09:36:51',
    //   crpReturnCode: 'Uploaded',
    //   fileName: 'FDCTB2023315114159CP0010000000',
    //   extension: 'zip',
    // },
    // {
    //   msgId: '00000011122222',
    //   remark: '張大名',
    //   createdBy: 'ty',
    //   createdTime: '2021/06/12 09:36:51',
    //   crpReturnCode: 'Upload Failed',
    //   fileName: 'FDCTB2023315114159CP0010000000',
    //   extension: 'zip',
    // },
    // {
    //   msgId: '00000011122223',
    //   remark: '黃一一',
    //   createdBy: 'ty',
    //   createdTime: '2021/06/12 09:36:51',
    //   crpReturnCode: 'CRP Accepted',
    //   fileName: 'FDCTB2023315114159CP0010000000',
    //   extension: 'zip',
    // },
    // {
    //   msgId: '00000011122224',
    //   remark: '赵五六',
    //   createdBy: 'ty',
    //   createdTime: '2021/06/12 09:36:51',
    //   crpReturnCode: 'CRA001, CRA002 Accepted',
    //   fileName: 'FDCTB2023315114159CP0010000000',
    //   extension: 'zip',
    // },
  ],
  dialogObj: { // params.dialogObj
    dialogFormVisible: false,
    formLabelWidth: '140px',
    form: { // params.dialogObj.form
      name: 'abc',
      region: 'beijing',
    },
  },
  fileList: [], // params.fileList
  KeyFilePassword: '11111', // params.KeyFilePassword
})
const toDetail = (obj) => {
  console.log(obj)
  params.dialogObj.dialogFormVisible = true
}
const toMessageDetail = (item) => {
  params.dialogObj.dialogFormVisible = false
  console.log(item)
  const id = 'aaa'
  // router.push(`/DataSubmissionService/${id}`)
  router.push({ path: `/DataSubmissionService/${id}`, state: { params: item } })
}
// const aaa = () => {
//   console.log('aaa按钮')
//   queryGet().then((res) => {
//     console.log('查询结果。', res)
//   })
// }
// const bbb = () => {
//   console.log('bbb按钮')
// }

const query = () => {
  dataSubmissionListUpload({
    // endTime: '2023-03-16T04:25:36.992Z',
    // isMainFlow: false,
    // msgType: 'string',
    // orderedBy: 'createdTime',
    // orders: 'asc',
    pageNum: 1,
    pageSize: 50,
    // ptCode: 'string',
    // startTime: '2023-03-16T04:25:36.992Z',
  }).then((res) => {
    window.console.log('数据上传历史查询接口', res)

    if (res.status === 200) {
      if (res.data.returnCode === 'CRP00000' && res.data.returnDesc === 'Success') {
        params.tableData = res.data.list
      }
      else {
        ElMessage({
          message: 'Upload Failed!',
          type: 'error',
        })
      }
    }
    else {
      ElMessage({
        message: 'Upload Failed!',
        type: 'error',
      })
    }
  })
}
</script>

<template>
  <div class="reporting">
    <h1 style="font-size:30px;">
      Data Submission
    </h1>
    <div mt-6>
      <el-date-picker
        v-model="params.filterQueryObj.startTime"
        class="w-64 mr-3"
        type="date"
        placeholder="Please select the start time"
      />
      <el-date-picker
        v-model="params.filterQueryObj.endTime"
        class="w-64 mr-3"
        type="date"
        placeholder="Please select the end time"
      />
      <el-select v-model="params.filterQueryObj.fileType" placeholder="Please select a file type" class="w-64 mr-3">
        <el-option
          v-for="item in params.fileTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="params.filterQueryObj.fileName" class="w-64 mr-3" placeholder="Please enter a file name" />
      <el-button color="#626aef" @click="query">
        <el-icon i-carbon:search />Search
      </el-button>
    </div>
    <div class="btn-content" mt-6>
      <!-- <el-input v-show="isShowSearch" v-model="name" placeholder="Please input" style="width:200px;" /> -->
      <el-button color="#626aef" @click="onUpload">
        <el-icon i-carbon:add />Data File Upload
      </el-button>
    </div>
  </div>
  <div mt-6>
    <el-table :data="params.tableData" style="width: 100%" border>
      <el-table-column fixed prop="msgId" label="MsgId" />
      <el-table-column prop="remark" label="Remark" />
      <el-table-column prop="createdBy" label="Uploaded By" width="120" />
      <el-table-column prop="createdTime" label="Upload Time" width="160" />
      <el-table-column prop="fileName" label="File Name" />
      <el-table-column prop="extension" label="Extension" width="90" />
      <el-table-column prop="createdTime" label="Upload Time" />
      <el-table-column label="Status">
        <template #default="scope">
          <el-tag v-if="scope.row.crpReturnCode === 'CRP00000'" class="ml-2" type="success">
            Uploaded
          </el-tag>
          <el-tag v-else-if="scope.row.crpReturnCode !== 'CRP00000'" class="ml-2" type="danger">
            Upload Failed
          </el-tag>
          <el-tag v-else-if="scope.row.crpReturnCode" class="ml-2" type="warning">
            CRP Accepted
          </el-tag>
          <span v-else>{{ scope.row.crpReturnCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Details" width="120">
        <template #default="scope">
          <el-button size="small" color="#626aef" :dark="isDark" @click="toMessageDetail(scope)">
            <!-- <el-icon i-carbon:next-outline /> -->
            View Details
          </el-button>
        <!-- <el-button v-else size="small" color="#626aef" :dark="isDark" @click="toDetail(scope)">
            <el-icon i-carbon:next-outline />
            Download
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div mt-6 style="float: right;">
      <el-pagination
        v-model:current-page="currentPage2"
        v-model:page-size="pageSize2"
        :page-sizes="[10, 20, 50, 100]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="sizes, prev, pager, next"
        :total="200"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <el-dialog v-model="params.dialogObj.dialogFormVisible" title="Historical Data Download File">
    <el-form :model="params.dialogObj.form">
      <el-form-item label="Private Key File：" :label-width="params.dialogObj.formLabelWidth">
        <el-upload
          ref="uploadRef"
          v-model:file-list="params.fileList"
          class="upload-demo"
          action=""
          :auto-upload="false"
        >
          <template #trigger>
            <el-button color="#626aef">
              Private Key File
            </el-button>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="Key File Password：" :label-width="params.dialogObj.formLabelWidth">
        <el-input v-model="params.KeyFilePassword" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="params.dialogObj.dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" color="#626aef" @click="params.dialogObj.dialogFormVisible = false">
          Upload
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.reporting{
  h1{
    font-size: 30px;
  }
.btn-content{
  text-align: right;
}
}
</style>
