import {makeVar} from '@apollo/client';

import {PostType} from '../types';

export const setAllPosts = makeVar<PostType[]>([]);
export const setPostParentId = makeVar<string>('');
export const setTotalPostsCount = makeVar<number>(0);
export const setCurrentPage = makeVar<number>(1);