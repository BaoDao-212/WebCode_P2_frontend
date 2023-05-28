// @ts-ignore
/* eslint-disable */

declare namespace API {
    type TableListResult<T = any> = {
        list: T;
        pagination?: PaginationResult;
    };

    type PaginationResult = {
        page: number;
        size: number;
        total: number;
    };

    type PageParams<T = any> = {
        limit?: number;
        page?: number;
    } & {
        [P in keyof T]?: T[P];
    };

    type ErrorResponse = {
        errorCode: string;
        errorMessage?: string;
        success?: boolean;
    };
}
