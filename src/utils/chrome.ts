export function getTabGroupIdNone(): number {
  return chrome.tabGroups?.TAB_GROUP_ID_NONE ?? -1
}

export function existsTabGroups(): boolean {
  return typeof chrome.tabGroups === 'object'
}
