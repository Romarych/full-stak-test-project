export type GetAllPostsType = {
    offset: number
    limit: number
    sortField: string
    sortIndex: string
};

export type CreatePostType = {
    input: PostType
};

export type PostType = {
    parentId?: string
    userName: string
    email: string
    homePage?: string
    text: string
    photo?: string
    file?: any
};

