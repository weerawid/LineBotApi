export interface SlipApiModel {
  slip: SlipModel[]
}

export interface SlipModel {
  apiName: string
  maxValue: number,
  url?: string | null,
  key?: string | null
}