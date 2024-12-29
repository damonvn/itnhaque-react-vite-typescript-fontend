import axios from './axios-customize'
import { IBackendRes, ILesson, IContent, INewChapter, INewLesson, ICourse, IAddLessonVideo, INewCourse, ICoursePages, Pages, IPagesCourse, IUpdateCourse, IUpdateCourseActive, ILogin, IResUserLogin, IAccount, IFetchAccount } from '@/types/backend';


export const callFetchContent = async (id: number) => {
    return (await axios.get<IBackendRes<IContent>>(`/api/v1/content/${id}`)).data;
}

export const callFetchLesson = async (id: number) => {
    return (await axios.get<IBackendRes<ILesson>>(`/api/v1/lesson/${id}`)).data;
}



export const callCreateChapter = async (chapter: INewChapter) => {
    return (await axios.post<IBackendRes<IContent>>('/api/v1/chapter', { ...chapter })).data;
}

//INewLesson

export const callCreateLesson = async (lesson: INewLesson) => {
    return (await axios.post<IBackendRes<IContent>>('/api/v1/lesson', { ...lesson })).data;
}

export const callUpdateLesson = async (content: IContent) => {
    return (await axios.put<IBackendRes<IContent>>('/api/v1/lesson/update', { ...content })).data;
}

export const callAddLessonVideo = async (lesson: IAddLessonVideo) => {
    return (await axios.put<IBackendRes<IContent>>('/api/v1/lesson/video', { ...lesson })).data;
}

export const callUploadCourseImage = async (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return (await axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })).data;
}

export const callCreateCourse = async (course: INewCourse) => {
    return (await axios.post<IBackendRes<IContent>>('/api/v1/course', { ...course })).data;
}

export const callFetchCourses = async (query: string) => {
    return (await axios.get<IBackendRes<Pages<ICoursePages>>>(`/api/v1/course?${query}`)).data;
}

export const callFetchCourse = async (id: number) => {
    return (await axios.get<IBackendRes<ICourse>>(`/api/v1/course/${id}`)).data;
}

export const callFetchUpdateCourse = async (id: number) => {
    return (await axios.get<IBackendRes<ICoursePages>>(`/api/v1/course/update/${id}`)).data;
}

export const callUpdateCourse = async (course: IUpdateCourse) => {
    return (await axios.put<IBackendRes<ICoursePages>>('/api/v1/course', { ...course })).data;
}


export const callUpdateCourseActive = async (course: IUpdateCourseActive) => {
    return (await axios.put<IBackendRes<null>>('/api/v1/course/active', { ...course })).data;
}

export const callLogin = async (user: ILogin) => {
    return (await axios.post<IBackendRes<IResUserLogin>>('/api/v1/auth/login', { ...user })).data;
}

export const callLogout = async () => {
    return (await axios.post<IBackendRes<null>>('/api/v1/auth/logout')).data;
}

export const callFetchAccount = async () => {
    return (await axios.get<IBackendRes<IFetchAccount>>('/api/v1/auth/account')).data
}




