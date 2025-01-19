import axios from './axios-customize'
import {
    IBackendRes, ILesson, IContent, INewChapter, INewLesson, ICourse,
    IAddLessonVideo, INewCourse, IUpdateCourse, IUpdateCourseActive,
    ILogin, IResUserLogin, IFetchAccount, ISkill, ISkillArray, ICategoryArray,
    ICourseUpdate, ICourseClientArray, LessonParameters, IContentDTO, IRole,
    IUser, IPagination, ICourseCard,
    IUserCreate,
    IRoleCreate,
    IRoleUpdate,
    ICategory,
    ICategoryCreate,
    ISkillCreate,
    IUserUpdate,
    IUserChangePassword
} from '@/types/backend';


export const callFetchClientContent = async (id: number) => {
    return (await axios.get<IBackendRes<IContentDTO>>(`/api/v1/client/content/dto/${id}`)).data;
}

export const callFetchContent = async (id: number) => {
    return (await axios.get<IBackendRes<IContentDTO>>(`/api/v1/content/${id}`)).data;
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
    return (await axios.get<IBackendRes<IPagination<ICourseCard[]>>>(`/api/v1/course?${query}`)).data;
}

export const callFetchCourse = async (id: number) => {
    return (await axios.get<IBackendRes<ICourse>>(`/api/v1/course/${id}`)).data;
}

export const callFetchClientCourse = async (id: number) => {
    return (await axios.get<IBackendRes<ICourse>>(`/api/v1/client/course/${id}`)).data;
}

export const callFetchUpdateCourse = async (id: number) => {
    return (await axios.get<IBackendRes<ICourseUpdate>>(`/api/v1/course/update/${id}`)).data;
}

export const callUpdateCourse = async (course: IUpdateCourse) => {
    return (await axios.put<IBackendRes<ICourseCard>>('/api/v1/course', { ...course })).data;
}


export const callUpdateCourseActive = async (course: IUpdateCourseActive) => {
    return (await axios.put<IBackendRes<null>>('/api/v1/course/active', { ...course })).data;
}

export const callLogin = async (user: ILogin) => {
    const res: IBackendRes<IResUserLogin> = (await axios.post('/api/v1/auth/login', { ...user })).data;
    return res;
}

export const callLogout = async () => {
    return (await axios.post<IBackendRes<null>>('/api/v1/auth/logout')).data;
}

export const callFetchAccount = async () => {
    return (await axios.get<IBackendRes<IFetchAccount>>('/api/v1/auth/account')).data
}

export const callFetchAllSkills = async () => {
    return (await axios.get<IBackendRes<ISkillArray>>('/api/v1/skill/all')).data
}

export const callFetClientCourses = async (query?: string) => {
    return (await axios.get<IBackendRes<ICourseClientArray>>(`/api/v1/client/course?${query}`)).data
}

export const callFetchChapterById = async (id: number) => {
    return (await axios.get<IBackendRes<any>>(`/api/v1/chapter/${id}`)).data
}

export const callGetLessonParameters = async (id: number) => {
    return (await axios.post<IBackendRes<LessonParameters>>('/api/v1/client/lesson/parameters', { contentId: id })).data
}

export const callNextBtnHandle = async (id: number) => {
    return (await axios.post<IBackendRes<number>>('/api/v1/client/lesson/next', { contentId: id })).data
}

export const callPrevBtnHandle = async (id: number) => {
    return (await axios.post<IBackendRes<number>>('/api/v1/client/lesson/previous', { contentId: id })).data
}

export const callCreateUser = async (user: IUserCreate) => {
    return (await axios.post<IBackendRes<IUser>>('/api/v1/user', { ...user })).data;
}

export const callUpdateUser = async (user: IUserUpdate) => {
    return (await axios.put<IBackendRes<IUserUpdate>>('/api/v1/user', { ...user })).data;
}


export const callFetchUsers = async (query: string) => {
    return (await axios.get<IBackendRes<IPagination<IUser[]>>>(`/api/v1/user${query}`)).data
}

export const callFetchUserById = async (id: number) => {
    return (await axios.get<IBackendRes<IUserUpdate>>(`/api/v1/user/${id}`)).data
}

export const callChangeUserPassword = async (user: IUserChangePassword) => {
    const res = await axios.put<IBackendRes<null>>('/api/v1/user/password', { ...user });
    return res.data;
}

export const callDelelteUser = async (id: number) => {
    return (await axios.delete<IBackendRes<null>>(`/api/v1/user/${id}`)).data
}

export const callFetchRoles = async (query: string) => {
    return (await axios.get<IBackendRes<IPagination<IRole[]>>>(`/api/v1/role${query}`)).data
}

export const callFetchAllRoles = async () => {
    return (await axios.get<IBackendRes<IRole[]>>('/api/v1/role/all')).data
}

export const callCreateRole = async (role: IRoleCreate) => {
    return ((await axios.post<IBackendRes<IRole>>('/api/v1/role', { ...role })).data);
}

export const callDeleteRole = async (id: number) => {
    const res: IBackendRes<null> = (await axios.delete(`/api/v1/role/${id}`)).data;
    return res;
}

export const callFetchRoleById = async (id: number) => {
    return (await axios.get<IBackendRes<IRoleUpdate>>(`/api/v1/role/${id}`)).data
}

export const callUpdateRole = async (role: IRoleUpdate) => {
    return (await axios.put<IBackendRes<IRoleUpdate>>('/api/v1/role', { ...role })).data
}

export const callCreateCategory = async (category: ICategoryCreate) => {
    return ((await axios.post<IBackendRes<ICategory>>('/api/v1/category', { ...category })).data);
}

export const callFetchCategoryById = async (id: number) => {
    return (await axios.get<IBackendRes<ICategory>>(`/api/v1/category/${id}`)).data
}

export const callUpdateCategory = async (category: ICategory) => {
    return (await axios.put<IBackendRes<ICategory>>('/api/v1/category', { ...category })).data
}

export const callFetchAllCategories = async () => {
    return (await axios.get<IBackendRes<ICategoryArray>>('/api/v1/category/all')).data
}

export const callFetchCategoriesPagination = async (query: string) => {
    return (await axios.get<IBackendRes<IPagination<ICategory[]>>>(`/api/v1/category${query}`)).data
}

export const callDeleteCategory = async (id: number) => {
    const res: IBackendRes<null> = (await axios.delete(`/api/v1/category/${id}`)).data;
    return res;
}


export const callCreateSkill = async (skill: ISkillCreate) => {
    return ((await axios.post<IBackendRes<ISkill>>('/api/v1/skill', { ...skill })).data);
}

export const callFetchSkillsPagination = async (query: string) => {
    return (await axios.get<IBackendRes<IPagination<ISkill[]>>>(`/api/v1/skill${query}`)).data
}

export const callDeleteSkill = async (id: number) => {
    const res: IBackendRes<null> = (await axios.delete(`/api/v1/skill/${id}`)).data;
    return res;
}

export const callFetchSkillById = async (id: number) => {
    return (await axios.get<IBackendRes<ISkill>>(`/api/v1/skill/${id}`)).data
}

export const callUpdateSkill = async (skill: ISkill) => {
    return (await axios.put<IBackendRes<ISkill>>('/api/v1/skill', { ...skill })).data
}
