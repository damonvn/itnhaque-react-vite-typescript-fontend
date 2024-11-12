export interface IBackendRes<T> {
    error?: string;
    message: string;
    statusCode: number;
    data?: T;
}

export interface ILesson {
    id: number;
    title: string;
    linkVideo: string;
    courseId: number;
    contentId: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IChapter {
    id: number;
    title: string;
    lessons: ILesson[];
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface IContent {
    id: number;
    courseId: number;
    chapterId: number;
    title: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}