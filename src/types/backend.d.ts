export interface IBackendRes<T> {
    error?: string;
    message: string;
    statusCode: number;
    data?: T;
}


export interface ICourse {
    id: number;
    title: string;
    image: string;
    description: string;
    active: boolean;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    chapters: IChapter[];
}

export interface ICourseCard {
    id: number;
    title: string;
    image: string;
    description: string;
    active: boolean;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface ICourseClient {
    id: number;
    title: string;
    image: string;
    description: string;
    active: boolean;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}

export type ICourseClientArray = ICourseClient[];

export interface ICourseUpdate {
    id: number;
    title: string;
    image: string;
    description: string;
    active: boolean;
    category: {
        id: number,
        name: string,
        value: string
    };
    skill: {
        id: number,
        name: string,
        value: string
    }
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface INewCourse {
    title: string;
    description: string;
    image: string;
    category: {
        id: number
    };
    skill: {
        id: number
    };
}



export interface IUpdateCourse {
    id: number;
    title: string;
    description: string;
    image: string;
    category: {
        id: number
    };
    skill: {
        id: number
    };
}

export interface IUpdateCourseActive {
    id: number;
    title: string;
    active: boolean;
}


export interface ILesson {
    id: number;
    title: string;
    linkVideo: string;
    courseId: number;
    contentId: number;
    indexInChapter: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IChapter {
    id: number;
    indexInCourse: number;
    title: string;
    lessons: ILesson[];
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}

interface IUpdateChapter {
    id: number,
    title: string
}

export interface INewChapterCourse {
    id: number
}

export interface INewChapter {
    title: string;
    course: INewChapterCourse;
    indexInCourse: number;
}


export interface INewLessonChapter {
    id: number;
}


export interface INewLesson {
    title: string;
    courseId: number;
    chapter: INewLessonChapter;
    indexInChapter: number;
}

export interface IContent {
    id: number;
    courseId: number;
    chapterId: number;
    lessonId: number;
    title: string;
    lessonVideoURL: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IContentDTO {
    id: number;
    courseId: number;
    chapterId: number;
    lessonId: number;
    title: string;
    courseTitle: string;
    lessonVideoURL: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IAddLessonVideo {
    lessonId: number,
    lessonVideoURL: string;
}


export interface ILogin {
    username: string;
    password: string;
};

export interface IAccount {
    id: number;
    email: string;
    name: string;
    role: string;
}

export interface IResUserLogin {
    user: IAccount;
    accessToken: string;
    refreshToken: string;
}

export interface IFetchAccount {
    user: IAccount;
}

export interface ICategory {
    id: number;
    name: string;
    value: string;
}

export interface ICategoryCreate {
    name: string;
    value: string;
}


export type ICategoryArray = ICategory[];

export interface ISkill {
    id: number;
    name: string;
    value: string;
}

export interface ISkillCreate {
    name: string;
    value: string;
}


export type ISkillArray = ISkill[];

export interface LessonParameters {
    lessonInChapterIndex: number;
    chapterInCourseIndex: number;
    courseChapterSize: number;
    chapterLessonSize: number;
}

export interface IPagination<T> {
    meta: Meta;
    result: T;
}

export interface IRole {
    id: number;
    name: string;
    description: string;
}

export interface IRoleUpdate {
    id: number
    name: string;
    description: string;
}

export enum GenderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: GenderEnum;
    address?: string;
    phone?: string;
    refreshToken?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    role: {
        id: number;
        name: string;
    };
}

export interface IUserCreate {
    name: string;
    email: string;
    password: string;
    gender: string;
    address: string;
    phone: string;
    role: {
        id: number
    }
}

export interface IUserUpdate {
    id: number;
    name: string;
    email: string;
    gender: string;
    address: string;
    phone: string;
    role: {
        id: number,
    }
}

export interface IUserChangePassword {
    id: number;
    oldPassword: string;
    newPassword: string;
}

export interface IRoleCreate {
    name: string;
    description: string
}
