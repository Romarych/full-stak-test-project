import React, {FC, useEffect} from 'react';
import {useQuery, useReactiveVar, useSubscription} from '@apollo/client';

import {PostType} from '../../types';
import {setAllPosts, setCurrentPage, setTotalPostsCount} from '../../cache';
import {GET_ALL_POSTS} from '../../graphq/query/getAllPosts';
import {Pagination} from '../common/Pagination';
import {Post} from './Post';
import {PostForm} from '../PostForm';

export const Posts: FC = () => {
    const allPosts = useReactiveVar(setAllPosts);
    const currentPage = useReactiveVar(setCurrentPage);

    const {data, fetchMore} = useQuery(GET_ALL_POSTS, {
        variables: {
            offset: 1,
            limit: 25
        }
    });

    useEffect(() => {
        data && setAllPosts(data.getAllPosts.posts)
        data && setTotalPostsCount(data.getAllPosts.count)

    }, [data]);

    useEffect(() => {
        onPageChanged(currentPage);
    }, [currentPage]);

    const onPageChanged = async (currentPage: number) => {
        const {data} = await fetchMore({
            variables: {
                offset: currentPage,
                limit: 25,
                subQuery: false
            }
        });
        data && setAllPosts(data?.getAllPosts.posts);
        data && setTotalPostsCount(data?.getAllPosts.count);
    }

    return <div className="text-center w-1/2 mx-auto my-5">
        {allPosts &&
            [...allPosts].reverse().map((post: PostType, index) =>
                <Post key={post.id || index} post={post}/>
            )}
        <PostForm/>
        <Pagination/>
    </div>
};