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
}

export interface IUpdateCourse {
    id: number;
    title: string;
    description: string;
    image: string;
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