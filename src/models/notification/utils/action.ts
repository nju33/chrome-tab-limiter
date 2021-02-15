import { whereEq } from 'ramda'

export const notificationClicksAtFrame = whereEq({ action: '' })
export const notificationClicksAsReopen = whereEq({ action: 'reopen' })
export const notificationClicksAsClose = whereEq({ action: 'close' })
