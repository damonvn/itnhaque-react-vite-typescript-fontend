import axios from './axios-customize'


export const callFetchAccount = () => {
    return axios.get('/')
}

export const callCreateLesson = (quill: any) => {
    return axios.post('/api/v1/lesson', { ...quill })
}

export const callFetchLesson = (id: number) => {
    return axios.get(`/api/v1/lesson/${id}`)
}
