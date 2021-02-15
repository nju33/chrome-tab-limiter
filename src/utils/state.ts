import { startsWith } from 'ramda'
import { getTabGroupIdNone } from './chrome'

const base = chrome.runtime.getURL('blankpage.html')
export function isBlankPage(url: string): boolean {
  return startsWith(base, url)
}

export function isGroupTab({
  groupId = getTabGroupIdNone()
}: {
  groupId: number
}): boolean {
  return groupId > getTabGroupIdNone()
}

export function isPinnedTab({ pinned }: { pinned: boolean }): boolean {
  return pinned
}
