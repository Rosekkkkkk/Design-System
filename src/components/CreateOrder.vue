<template>
  <section class="create-order-panel">
    <el-form ref="createOrderFormRef" class="create-order-form" :model="createOrderForm" :rules="createOrderRules" label-position="left">
      <el-form-item label="商家名称" prop="merchantName">
        <el-input v-model="createOrderForm.merchantName" placeholder="请输入或选择" />
      </el-form-item>

      <el-form-item label="客户信息" prop="customerInfo">
        <el-input v-model="createOrderForm.customerInfo" placeholder="请输入或选择" />
      </el-form-item>

      <el-form-item label="照片类型" prop="photoType">
        <el-input v-model="createOrderForm.photoType" placeholder="请输入或选择" />
      </el-form-item>

      <el-form-item label="照片张数" prop="photoCount">
        <el-input v-model="createOrderForm.photoCount" placeholder="请输入或选择" />
      </el-form-item>

      <el-form-item label="接单价" prop="acceptUnitPrice">
        <el-input v-model="createOrderForm.acceptUnitPrice" placeholder="请输入或选择" />
      </el-form-item>

      <el-form-item label="派单价" prop="dispatchUnitPrice">
        <el-input v-model="createOrderForm.dispatchUnitPrice" placeholder="请输入或选择" />
      </el-form-item>

      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="createOrderForm.orderNo" placeholder="请输入或选择" />
      </el-form-item>

      <el-form-item label="下单时间" prop="orderedAt">
        <el-input v-model="createOrderForm.orderedAt" placeholder="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>

      <el-form-item class="remark-form-item" label="备注">
        <el-input v-model="createOrderForm.remark" placeholder="请输入备注" resize="none" type="textarea" />
      </el-form-item>
    </el-form>
  </section>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CreateOrderForm } from '../types/CreateOrder'

const props = defineProps<{
  initialForm?: Partial<CreateOrderForm>
}>()

const emit = defineEmits<{
  confirm: [form: CreateOrderForm]
}>()

const createOrderFormRef = ref<FormInstance>()

const getEmptyCreateOrderForm = (): CreateOrderForm => ({
  merchantName: '',
  customerInfo: '',
  photoType: '',
  photoCount: '',
  acceptUnitPrice: '',
  dispatchUnitPrice: '',
  orderNo: '',
  orderedAt: '',
  remark: '',
})

const createOrderForm = reactive<CreateOrderForm>(getEmptyCreateOrderForm())

const requiredRule = (message: string) => [{ required: true, whitespace: true, message, trigger: 'blur' }]

const createOrderRules = reactive<FormRules<CreateOrderForm>>({
  merchantName: requiredRule('请输入商家名称'),
  customerInfo: requiredRule('请输入客户信息'),
  photoType: requiredRule('请输入照片类型'),
  photoCount: requiredRule('请输入照片张数'),
  acceptUnitPrice: requiredRule('请输入接单价'),
  dispatchUnitPrice: requiredRule('请输入派单价'),
  orderNo: requiredRule('请输入订单号'),
  orderedAt: requiredRule('请输入下单时间'),
})

watch(
  () => props.initialForm,
  async (initialForm) => {
    Object.assign(createOrderForm, getEmptyCreateOrderForm(), initialForm)
    await nextTick()
    createOrderFormRef.value?.clearValidate()
  },
  { deep: true, immediate: true },
)

const handleConfirm = async () => {
  if (!createOrderFormRef.value) return

  try {
    await createOrderFormRef.value.validate()
    emit('confirm', { ...createOrderForm })
  } catch {
    // Element Plus 会自动展示字段错误，这里保持弹窗不关闭。
  }
}

defineExpose({
  submit: handleConfirm,
})
</script>

<style scoped lang="scss">
.create-order-panel {
  min-height: 100%;
  color: #001b44;
  background: #fff;
}

.create-order-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  column-gap: 48px;
  row-gap: 16px;
  padding: 28px 34px 18px;

  :deep(.el-form-item) {
    align-items: center;
    margin: 0;
  }

  :deep(.el-form-item__label) {
    width: 78px;
    flex: 0 0 78px;
    height: 32px;
    padding-right: 16px;
    color: #001b44;
    font-size: 13px;
    font-weight: 600;
    line-height: 32px;
    white-space: nowrap;
  }

  :deep(.el-form-item__content) {
    min-width: 0;
  }

  :deep(.el-form-item__error) {
    padding-top: 3px;
    color: #f56c6c;
    font-size: 12px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner) {
    border-radius: 2px;
    box-shadow: 0 0 0 1px #d7e3f3 inset;
  }

  :deep(.el-input__wrapper) {
    min-height: 34px;
  }

  :deep(.el-input__inner),
  :deep(.el-textarea__inner) {
    color: #001b44;
    font-size: 13px;
  }

  :deep(.el-input__inner::placeholder),
  :deep(.el-textarea__inner::placeholder) {
    color: #b0c0d6;
  }
}

.remark-form-item {
  grid-column: 1 / -1;

  :deep(.el-form-item__content) {
    align-self: stretch;
  }

  :deep(.el-textarea),
  :deep(.el-textarea__inner) {
    height: 92px;
  }
}

@media (max-width: 720px) {
  .create-order-form {
    grid-template-columns: 1fr;
    padding: 22px 18px;
  }
}
</style>
