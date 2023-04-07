import path from 'path';

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

export type SessionCaptchaType = {
    session: {
        captcha: string
        save: () => void
    }
}

export type CaptchaRequestType = {
    body: {
        captcha: string
    };
}

export type FilesType = {
    files: {
        file: {
            name: string
            data: Buffer
            md5: string
            mv: (url: string) => void
            size: 405467,
            encoding: string,
            tempFilePath: string,
            truncated: boolean,
            mimetype: string,


        }
    }
}

