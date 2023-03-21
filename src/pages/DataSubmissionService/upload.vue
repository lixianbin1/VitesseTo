<script setup lang="ts">
import axios from 'axios'
import CryptoJS from 'crypto-js'
import JSZip from 'jszip'
// import { saveAs } from 'file-saver'
import { dataUpload, participantCRA_status } from '@/api'
import { randomGenerate } from '@/composables/AES'
const props = defineProps<{ id: string }>()
console.log(props)
const name = ref('123e4567-e89b-12d3-a456-556642440000')
const CRA = ref('CRA112')
const se = ref('Option2')
// 数据state
const fileList = reactive({
  list: [],
})

const router = useRouter()
const back = () => {
  router.replace('/DataSubmissionService')
}

const data = reactive({
  cras: [], // CRAS列表
  fileList: [], // 上传文件列表
  crp_file: '', // 压缩后的文件
  contributionTypeList: [
    { value: 'CONTR', label: 'Data contribution' }, // data.params.submissionType
    { value: 'AMEND', label: 'Data amendment' },
    { value: 'INLDL', label: 'Initial Data Load' },
  ],
  fileActionList: [
    { value: 'CRT', label: 'Create' },
    { value: 'REP', label: 'Replace' },
  ],
  fileFormatList: [
    { value: 'TUDF', label: 'TUDF' },
    { value: 'TUDX', label: 'TUDF (Extended)' },
    { value: 'CDSF', label: 'CDSF' },
    { value: 'CDAF', label: 'CDAF' },
    { value: 'PDF', label: 'PDF' },
    { value: 'RTF', label: 'RTF' },
    { value: 'CSV', label: 'CSV' },
  ],
  params: {
    submissionType: '',
    originalFileName: 'ty', // data.params.originalFileName
    encryptFileName: '',
    fileSize: '',
    fileAction: '',
    fileChecksum: '',
    dataFormat: '',
    dataCompression: 'ZIP',
    noOfRecords: '1',
    initiator: '',
    remarks: '',
    symmetricKey: '',
    confirmSymmetricKey: '',
  },
})
// 上传
const dataSubmission = () => {
  const obj = {
    submissionType: data.params.submissionType,
    bnesDest: data.cras.map(item => item.participantCode),
    encryptFileInfo: {
      dataCompression: data.params.dataCompression,
      dataFormat: data.params.dataFormat,
      fileAction: data.params.fileAction,
      fileChecksum: data.params.fileChecksum,
      fileName: data.params.encryptFileName,
      fileSize: data.params.fileSize,
      noOfRecords: data.params.noOfRecords,
      originFileName: data.params.originalFileName,
    },
    remarks: data.params.remarks,
    resumeId: '2',
    symKey: data.params.symmetricKey,
  }
  const blob = new Blob([JSON.stringify(obj)], {
    type: 'application/json',
  })

  // const formData = new FormData()
  // formData.append('crp_file', data.fileList[0].raw)
  // formData.append('crp_message', blob)

  const params = {
    crp_message: blob,
    crp_file: data.crp_file,
  }

  window.console.log('最后提交数据：', params, obj)
  dataUpload(params).then((res) => {
    // {"orgMsgId":"MCP00120210924143279","returnCode":"CRP00000","returnDesc":"Success","crpHttpStatus":200}
    window.console.log('数据上传：', res)
    if (res.status === 200) {
      if (res.data.returnCode === 'CRP00000' && res.data.returnDesc === 'Success') {
        ElMessage({
          message: 'Upload Success!',
          type: 'success',
        })
      }
      else {
        ElMessage({
          message: res.data.returnDesc,
          type: 'error',
        })
      }
    }
    else {
      ElMessage({
        message: res,
        type: 'error',
      })
    }
  })
}
// 获取CRA列表
const getCRAS = () => {
  participantCRA_status().then((res) => {
    window.console.log('获取CRA列表', res)
    if (res.status === 200) {
      if (res.data.returnCode === 'CRP00000' && res.data.returnDesc === 'Success')
        data.cras = res.data.results
      else
        data.cras = []
    }
    else { data.cras = [] }
  })
}
getCRAS()
// 获取堆成加密秘钥
const generateSymmetricKey = () => {
  if (data.params.symmetricKey && data.params.symmetricKey === data.params.confirmSymmetricKey) {
    const key = CryptoJS.PBKDF2(data.params.symmetricKey, '', { keySize: 128 / 64, iterations: 1 }).toString()
    window.console.log('对称秘钥：', key)
    // const keyString = randomGenerate(16)
    // const ivString = randomGenerate(16)
    data.params.symmetricKey = key
    data.params.confirmSymmetricKey = key
  // forData.ivString = ivString
  }
  else {
    ElMessage({
      message: 'Please ensure that the Symmetric Key is consistent with the Confirm Symmetric Key!',
      type: 'warning',
    })
  }
}
function getFileName(type: String, cp: String) { // type DCTB   cp:  CP001
// 文件类别   描述                                     支持格式
//   DCTB   Data Contribution                            TUDF/TUDF(Extended)/CDSF/CDAF/PDF1/RTF1
//   DAMD   Data Amendment                               TUDF / TUDF (Extended) / CDSF/ CDAF
//   CENQ   Credit Report Enquiry Request                TUEF / CDEF
//   CRPT   Credit Report                                TUEF / CDEF / PDF / RTF
//   PCST   PMDS Prescribed Consent List                 CSV
//   PWDL   Withdrawal of PMDS Prescribed Consent List   CSV
//   EFPT   Enquiry Footprint                            CFPF
//   DCRQ   Data Correction Request                      CRA dependent
//   DLST   Data Deletion List                           JSON
//   OTHR   Other File -

  let suffix = ''
  if (data.params.submissionType === 'INLDL') // 当提交方式submissionType为Initial Data Load的时候，文件名带后缀
    suffix = '.ZIP'

  const d = new Date()
  const date = d.toLocaleDateString().replace(/\//g, '') + d.toLocaleTimeString().replace(/:/g, '')
  return `F${type}${date}${cp}0000000${suffix}` // 初始要.ZIP
}
// 获取文件校验码
function getChecksum(file: File) {
  const a = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(file))
  // const b = CryptoJS.SHA256(buffer)
  // const key = CryptoJS.enc.Utf8.parse('abc')
  // console.log(key.toString())
  // console.log(a.toString())
  return a.toString()
}
// 将文件压缩成zip并加密
const onUpload = () => {
  const key = CryptoJS.enc.Utf8.parse(data.params.symmetricKey)
  window.console.log(key, data.params.symmetricKey)
  const iv = CryptoJS.enc.Utf8.parse('')
  const zip = new JSZip()
  for (const i in data.fileList)
    zip.file(data.fileList[i].name, data.fileList[i].raw)

  zip.generateAsync({ type: 'uint8array' }).then((zipData) => {
    window.console.log(zipData)
    // 使用AES CBC Pkcs7模式进行加密
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.lib.WordArray.create(zipData), key,
      {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      },
    )
    // 将加密后的数据转换为Base64字符串或其他格式
    const encryptedBase64 = encryptedData.toString()
    data.ciphertext2 = encryptedBase64
    const blob = new Blob([encryptedBase64], { type: 'text/plain;charset=utf-8' })

    // const blob = new Blob(byteArrays, { type: contentType })
    // blob转file
    const filename = getFileName('DCTB', 'CP001')
    // saveAs(blob, filename)
    const file = new File([blob], filename, { type: blob.type })
    console.log('File对象', file.size, file)
    const checksum = getChecksum(file)
    console.log('checksum:', checksum)
    data.params.encryptFileName = filename
    data.params.fileChecksum = checksum
    data.crp_file = file
    data.params.fileSize = file.size
    dataSubmission()
  })
}
</script>

<template>
  <div class="data-correction">
    <h1>Data Submission Service - Upload</h1>
    <div class="btn-content" mt-6>
      <el-button color="#626aef" :dark="isDark" @click="back">
        Back
      </el-button>
      <!-- <el-button color="#626aef" :dark="isDark" @click="aa"> -->
      <!-- test
      </el-button> -->
    </div>
    <div>
      <div class="item">
        <div class="title">
          Submission Type：
        </div>
        <div class="content">
          <el-select v-model="data.params.submissionType" placeholder="Please select a file type" style="width:300px;">
            <el-option
              v-for="item in data.contributionTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="item">
        <div class="title">
          File Action：
        </div>
        <div class="content">
          <el-select v-model="data.params.fileAction" placeholder="Select" style="width:300px;">
            <el-option
              v-for="item in data.fileActionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="item">
        <div class="title">
          File：
        </div>
        <div class="content">
          <el-upload
            ref="uploadRef"
            v-model:file-list="data.fileList"
            class="upload-demo"
            action=""
            :auto-upload="false"
          >
            <template #trigger>
              <el-button color="#626aef">
                File
              </el-button>
            </template>
          </el-upload>
        </div>
      </div>
      <div class="item">
        <div class="title">
          File Name：
        </div>
        <div class="content">
          <el-input v-model="data.params.encryptFileName" placeholder="Please input" style="width:300px;" />
        </div>
      </div>
      <div class="item">
        <div class="title">
          File Format：
        </div>
        <div class="content">
          <el-select v-model="data.params.dataFormat" placeholder="Select" style="width:300px;">
            <el-option
              v-for="item in data.fileFormatList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="item">
        <div class="title">
          File Compression：
        </div>
        <div class="content">
          <el-input v-model="data.params.dataCompression" placeholder="ZIP" style="width:300px;" />
        </div>
      </div>
      <div class="item">
        <div class="title">
          Symmetric Key：
        </div>
        <div class="content">
          <el-input v-model="data.params.symmetricKey" placeholder="Please input" style="width:300px;" />
        </div>
      </div>
      <div class="item">
        <div class="title">
          Confirm Symmetric Key：
        </div>
        <div class="content">
          <el-input v-model="data.params.confirmSymmetricKey" placeholder="Please input" style="width:300px;" />
          <el-button color="#626aef" :dark="isDark" class="ml-3" @click="generateSymmetricKey">
            <!-- <el-icon i-carbon:data-refinery-reference />  -->
            Generate Symmetric Key
          </el-button>
        </div>
      </div>
      <div class="item">
        <div class="title">
          CRAs Information：
        </div>
        <div class="content">
          <template v-for="item in data.cras" :key="item">
            <el-tag class="mr-2" type="success">
              {{ item.participantCode }}
            </el-tag>
          </template>
        </div>
      </div>
      <div class="item">
        <div class="title">
          No of Record：
        </div>
        <div class="content">
          <el-input v-model="data.params.noOfRecords" placeholder="Please input" style="width:300px;" />
        </div>
      </div>
      <div class="item">
        <div class="title">
          Data Correction Initiator：
        </div>
        <div class="content">
          <el-select v-model="data.params.initiator" placeholder="Select" style="width:300px;">
            <el-option
              v-for="item in data.cras"
              :key="item.participantCode"
              :label="item.participantCode"
              :value="item.participantCode"
            />
          </el-select>
        </div>
      </div>
      <div class="item">
        <div class="title">
          Data Correction Reference ID：
        </div>
        <div class="content">
          <el-input v-model="CRA" placeholder="Please input" style="width:300px;" />
        </div>
      </div>
      <div class="item">
        <div class="title">
          File Checksum：
        </div>
        <div class="content">
          <el-input
            v-model="data.params.fileChecksum"
            :rows="2"
            type="textarea"
            placeholder="Please input"
          />
        </div>
      </div>
      <div class="item">
        <div class="title">
          File Size：
        </div>
        <div class="content">
          <el-input
            v-model="data.params.fileSize"
            :rows="2"
            type="textarea"
            placeholder="Please input"
          />
        </div>
      </div>
      <div class="item">
        <div class="title">
          Remarks：
        </div>
        <div class="content">
          <el-input
            v-model="data.params.remarks"
            :rows="2"
            type="textarea"
            placeholder="Please input"
          />
        </div>
      </div>
    </div>
    <div mt-8 mb-6>
      <div class="item">
        <div class="title" />
        <div class="content">
          <el-button color="#626aef" :dark="isDark" @click="onUpload">
            <!-- <el-icon i-carbon:data-refinery-reference />  -->
            Upload
          </el-button>
        </div>
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
    // margin-top:20px;
    display:flex;
    justify-content: space-between;
  }
}
.upload-demo{
  width: 300px;
}
.data-correction{
  padding:15px;
  border:solid rgb(228,231,227) 1px;
  .item{
    display:flex;
    flex-flow:row nowrap;
    margin-top:15px;
    .title{
      width:236px;
      flex:none;
      text-align:right;
    }
    .content{
      flex:auto;
    }
  }
}
</style>
