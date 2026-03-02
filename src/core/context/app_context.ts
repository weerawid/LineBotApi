import { getConfig } from '../google/google_sheet'

/**
 * โครงสร้างของ config ที่ดึงมาจาก Google Sheet
 * ถ้าอยาก strict กว่านี้ สามารถกำหนด key เฉพาะได้
 */

/**
 * โครงสร้างของ AppContext
 */
export interface AppContext {
  config: Record<string, string | null> 
}

let context: AppContext | null = null

export async function initializeContext(): Promise<AppContext> {
  const config = await getConfig()

  context = {
    config
  }

  return context
}

export async function updateContext(): Promise<void> {
  if (!context) {
    throw new Error('AppContext not initialized')
  }

  const config = await getConfig()
  context.config = config
}

export async function getContext(): Promise<AppContext> {
  if (!context) {
    return await initializeContext()
  }

  return context
}
