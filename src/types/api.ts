import axios from '@/config/axios-customize'
import { IBackendRes } from './backend'

export const callGetHome = () => {
    return axios.get<IBackendRes<String>>('/')
}
