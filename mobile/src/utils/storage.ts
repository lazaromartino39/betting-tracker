import { MMKV } from 'react-native-mmkv'

export const mmkvStorage = new MMKV()

export const storage = {
  setItem: (key: string, value: string) => mmkvStorage.setString(key, value),
  getItem: (key: string) => mmkvStorage.getString(key),
  removeItem: (key: string) => mmkvStorage.delete(key),
  setJSON: (key: string, value: any) => mmkvStorage.setString(key, JSON.stringify(value)),
  getJSON: (key: string) => {
    const value = mmkvStorage.getString(key)
    return value ? JSON.parse(value) : null
  },
}
