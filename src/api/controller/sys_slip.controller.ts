import type { Request, Response } from "express"
import { getSysSlip, Result } from "../../usecase/get-sys-slip.usecase";
import { AppError, ErrorKey, getErrorMessage } from "../../core/error/error.app";
import { getContext } from "../../core/context/app_context";
import { SlipApiModel } from "../../model/slip-api.model";
import insertSysSlip from "../../usecase/insert-sys-slip.usecase";
import { SysSlipModel } from "../../model/sys-slip.model";
import updateSysSlip from "../../usecase/update-sys-slip.usecase";

type Params = {
  api: string;
};

const SLIP_API_MAX = 0

export async function getSlipApi(
  req: Request<Params>,
  res: Response
): Promise<void> {
  try {
    const context = await getContext()
    const config = context.config
    const slipApiList = (JSON.parse(config["SLIP_API"] as string) as SlipApiModel).slip
    const sysSlipList = await preConditionGetSysSlip()
    const sysSlipData = sysSlipList?.find(data => {
      return (data.sys_slip_value ?? 0) < (data.sys_slip_max ?? SLIP_API_MAX)
    })
    const sysConfig = slipApiList.find(config => config.apiName === sysSlipData?.sys_slip_api)
    
    if (sysSlipList && sysSlipList.length > 0) {
      res.status(200).json({
        success: true,
        data: {
          slip_api_name: sysSlipData?.sys_slip_api,
          slip_api_url: sysConfig?.url,
          slip_api_key: sysConfig?.key
        }
      });
    } else {
      throw new AppError(ErrorKey.DB_DATA_NOT_FOUND_00322)
    }
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}

export async function trick(
  req: Request<Params>,
  res: Response
): Promise<void> {
  try {
    const { api } = req.params
    const sysSlipList = await getSysSlip({ sys_slip_api: api }) as Result
    const sysSlipData = (sysSlipList.data as SysSlipModel[] | null)?.[0]
    if (!sysSlipData) {
      throw new AppError(ErrorKey.DB_DATA_NOT_FOUND_00322)
    }

    const result = await updateSysSlip({
      sys_slip_api: api,
      data: {
        sys_slip_value: (sysSlipData.sys_slip_value ?? 0) + 1,
        lastupdate: new Date()
      }
    })
    res.status(200).json(result);
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}

async function preConditionGetSysSlip(): Promise<SysSlipModel[] | null> {
  const toDay = new Date()
  var sysSlipData = await initialSysSlip() || []
  var isRefresh = false

  for (const slipData of sysSlipData) {
    const createDate = slipData.created_at || new Date()
    if ((toDay.getDate() - createDate.getDate()) >= 30) {
      if (slipData.sys_slip_api) {
        await updateSysSlip({
          sys_slip_api: slipData.sys_slip_api,
          data: {
            sys_slip_value: 0,
            lastupdate: new Date(),
            created_at: new Date()
          }
        })
      }
      isRefresh = true
    }
  }

  if (isRefresh) { 
    sysSlipData = await initialSysSlip() || []
  }

  return sysSlipData
}

async function initialSysSlip(): Promise<SysSlipModel[] | null> {
  const context = await getContext()
  const config = context.config
  const slipApiList = (JSON.parse(config["SLIP_API"] as string) as SlipApiModel).slip
  var sysSlipData = await updateSysSlipList()

  if (!sysSlipData) throw new AppError(ErrorKey.DB_DATA_NOT_FOUND_00322)

  if (sysSlipData.length === 0) {
    for (const slipApi of slipApiList) {
      await insertSysSlip({
        sys_slip_api: slipApi.apiName,
        sys_slip_value: 0,
        sys_slip_max: slipApi.maxValue,
        lastupdate: new Date(),
        created_at: new Date()
      })
    }
  } else {      
    const filteredSlipApiList = slipApiList.filter(api => !sysSlipData!.some(data => api.apiName === data.sys_slip_api))
    if (filteredSlipApiList.length > 0) {
      for (const slipApi of filteredSlipApiList) {
        await insertSysSlip({
          sys_slip_api: slipApi.apiName,
          sys_slip_value: 0,
          sys_slip_max: slipApi.maxValue,
          lastupdate: new Date(),
          created_at: new Date()
        })
      }
    }
  }
  sysSlipData = await updateSysSlipList()
  return sysSlipData
}

async function updateSysSlipList(): Promise<SysSlipModel[] | null> {
  var result = await getSysSlip() as Result
  return result.data as SysSlipModel[] | null
}