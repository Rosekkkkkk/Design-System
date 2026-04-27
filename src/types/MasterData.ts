export interface MasterDataPagination {
  pageNo: number
  pageSize: number
}

export interface MasterDataFilters {
  merchantName: string
}

export interface MerchantPhotoType {
  id: string
  photoType: string
  acceptPrice: number | undefined
  dispatchPrice: number | undefined
}

export interface MerchantCustomer {
  id: string
  customerName: string
  photoCount: number | undefined
}

export interface MerchantRecord {
  id: string
  merchantName: string
  photoTypes: MerchantPhotoType[]
  customers: MerchantCustomer[]
  createdAt: string
}

export interface MerchantDialogForm {
  merchantName: string
  photoTypes: MerchantPhotoType[]
  customers: MerchantCustomer[]
}
