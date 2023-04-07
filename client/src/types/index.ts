export type PostType = {
    createdAt?: Date
    id?: string
    parentId?: string
    userName: string
    text: string
    email: string
    homePage?: string
    photo?: string
    file?: string
    captcha: string
};

export type PaginationType = {
    portionSize?: number
    pageSize?: number
};