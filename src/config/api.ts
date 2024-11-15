import axios from './axios-customize'
import { IBackendRes, ILesson, IContent, INewChapter, INewLesson, ICourse } from '@/types/backend';


export const callFetchContent = async (id: number) => {
    return (await axios.get<IBackendRes<IContent>>(`/api/v1/content/${id}`)).data;
}

export const callFetchLesson = async (id: number) => {
    return (await axios.get<IBackendRes<ILesson>>(`/api/v1/lesson/${id}`)).data;
}

export const callFetchAccount = () => {
    return axios.get('/')
}

// export const callCreateLesson = (quill: any) => {
//     return axios.post('/api/v1/lesson', { ...quill })

// }


export const callFetchCourse = async (id: number) => {
    return (await axios.get<IBackendRes<ICourse>>(`/api/v1/course/${id}`)).data;
}

export const callCreateChapter = async (chapter: INewChapter) => {
    return (await axios.post<IBackendRes<IContent>>('/api/v1/chapter', { ...chapter })).data;
}

//INewLesson

export const callCreateLesson = async (lesson: INewLesson) => {
    return (await axios.post<IBackendRes<IContent>>('/api/v1/lesson', { ...lesson })).data;
}

export const callUpdateLessonContent = async (lesson: IContent) => {
    return (await axios.put<IBackendRes<IContent>>('/api/v1/lesson/content', { ...lesson })).data;
}


