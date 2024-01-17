import axios, { AxiosInstance } from 'axios'

const service: AxiosInstance = axios.create({
  timeout: 5000,
  baseURL: 'http://127.0.0.1:19088'
})

export default service
