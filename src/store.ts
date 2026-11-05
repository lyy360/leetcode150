import Taro from '@tarojs/taro'
import { Status } from './types'

const PROGRESS_KEY = 'lc150_progress'
const NOTES_KEY = 'lc150_notes'

export type ProgressMap = Record<string, Status>
export type NoteMap = Record<string, string>

export function loadProgress(): ProgressMap {
  try {
    return Taro.getStorageSync(PROGRESS_KEY) || {}
  } catch {
    return {}
  }
}

export function saveProgress(map: ProgressMap) {
  Taro.setStorageSync(PROGRESS_KEY, map)
}

export function loadNotes(): NoteMap {
  try {
    return Taro.getStorageSync(NOTES_KEY) || {}
  } catch {
    return {}
  }
}

export function saveNotes(map: NoteMap) {
  Taro.setStorageSync(NOTES_KEY, map)
}
