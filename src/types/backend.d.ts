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

export interface ICoursePages {
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

export type ICourseArray = ICoursePages[];

export interface Pages<ICourseArray> {
    meta: Meta;
    result: T;  // Có thể thay 'any' bằng kiểu dữ liệu phù hợp tùy theo yêu cầu
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

export type ICategoryArray = ICategory[];

export interface ISkill {
    id: number;
    name: string;
    value: string;
}

export type ISkillArray = ISkill[];

