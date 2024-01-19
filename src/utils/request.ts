import axios, { AxiosInstance } from 'axios'

const service: AxiosInstance = axios.create({
  timeout: 5000,
  baseURL: import.meta.env.VITE_INJECTOR_API
})

export default service
