// composables/useApi.ts
export const useApi = () => {
  const { $axios } = useNuxtApp()

  const get = async (url: string, params = {}) => {
    const res = await $axios.get(url, { params })
    return res.data
  }

  const post = async (url: string, data = {}) => {
    const res = await $axios.post(url, data)
    return res.data
  }

  return { get, post }
}
