import { v5 as uuidv5 } from 'uuid';
import type { Request, Response } from "express"
import insertLineEvent from "../../usecase/insert_line_event.usecase"
import { AppError, ErrorKey, getErrorMessage } from "../../core/error/error.app"
import UUIDNameSpace from '../../core/constraint/uuid_namespace.constraint';
import { getAddress, Result } from '../../usecase/get_address.usecase';
import { LineAddressModel } from '../../model/line_address.model';
import insertLineAddress from '../../usecase/insert_line_address.usecase';


export async function create(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { address_no, address_soi } = req.body
    const UUID_NAME_SPACE = UUIDNameSpace.UUID_ADDRESS

    if(!address_no) throw new AppError(ErrorKey.API_MISSING_PARAMETER_10001)

    const getAddressResult = await getAddress({ filter: { line_address_no: address_no } })
    if (!getAddressResult) return;
    const getAddressData = getAddressResult.data as LineAddressModel[] 
    if (getAddressData.length > 0) {
      res.status(201).json({
        success: true,
        data: getAddressData[0]
      })
    } else {
      const uuid = uuidv5(address_no, UUID_NAME_SPACE)
      const insertAddress = await insertLineAddress({
        address_uuid: uuid,
        address_no: address_no,
        address_soi: address_soi
      })
      if (insertAddress) {
        res.status(201).json({
          success: true,
          data: insertAddress.data
        })
      } else {
        throw new AppError(ErrorKey.DB_DATA_NOT_FOUND_00322)
      }
    } 
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}