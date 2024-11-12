import axios from './axios-customize'
import { IBackendRes, ILesson, IContent } from '@/types/backend';


export const callFetchContent = async (id: number) => {
    return (await axios.get<IBackendRes<IContent>>(`/api/v1/content/${id}`)).data;
}

export const callFetchLesson = async (id: number) => {
    return (await axios.get<IBackendRes<ILesson>>(`/api/v1/lesson/${id}`)).data;
}

export const callFetchAccount = () => {
    return axios.get('/')
}

export const callCreateLesson = (quill: any) => {
    return axios.post('/api/v1/lesson', { ...quill })

}




export const callFetchCourse = (id: number) => {
    return axios.get(`/api/v1/course/${id}`)
}

