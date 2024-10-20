export interface IBackendRes<T> {
    [x: string]: string;
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}
