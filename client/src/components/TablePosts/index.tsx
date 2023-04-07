import React, {FC, useEffect, useState} from 'react';
import {useQuery, useReactiveVar} from '@apollo/client';

import {PostType} from '../../types';
import {dateToString} from '../../utils/dateToString';
import {GET_ALL_POSTS} from '../../graphq/query/getAllPosts';
import {setAllPosts, setCurrentPage, setTotalPostsCount} from '../../cache';
import {Pagination} from '../common/Pagination';

export const PostsTable: FC = () => {
    const [sortField, setSortField] = useState<string>('createdAt');
    const [sortIndex, setSortIndex] = useState<string>('DESC');

    const allPosts = useReactiveVar(setAllPosts);
    const currentPage = useReactiveVar(setCurrentPage);

    const {data, fetchMore} = useQuery(GET_ALL_POSTS, {
        variables: {
            offset: 1,
            limit: 25,
        }
    });

    useEffect(() => {
        setAllPosts(data?.getAllPosts.posts);
        setTotalPostsCount(data?.getAllPosts.count);
    }, [data]);

    useEffect(() => {
        onPageChanged(currentPage);
    }, [currentPage, sortField, sortIndex]);

    const onPageChanged = async (currentPage: number) => {
        const {data} = await fetchMore({
            variables: {
                offset: currentPage,
                limit: 25,
                sortField,
                sortIndex,
                subQuery: false
            }
        });
        setAllPosts(data.getAllPosts.posts);
        setTotalPostsCount(data.getAllPosts.count);
    }


    return <div>
        <div className="mx-auto w-full text-center mt-10 mb-6">
            <select onChange={e => {
                setSortField(e.target.value);
            }}

                    className="mr-8 py-2 px-4 cursor-pointer rounded-[5px]" name="field">
                <option value="createdAt">Date</option>
                <option value="userName">User Name</option>
                <option value="email">Email</option>
            </select>
            <select onChange={e => {
                setSortIndex(e.target.value);
            }}
                    value={sortIndex}
                    className="py-2 px-4 cursor-pointer rounded-[5px]" name="index">
                <option value="ASC">ASC</option>
                <option value="DESC">DESC</option>
            </select>
        </div>
        <table className="mx-auto mb-10">
            <thead>
                <tr>
                    <th className="border border-black py-2 px-16">User Name</th>
                    <th className="border border-black py-2 px-16">Email</th>
                    <th className="border border-black py-2 px-16">Date</th>
                </tr>
            </thead>
            <tbody>
            {allPosts?.map((post: PostType) => {
                    return <tr key={post.id}>
                        <td className="border border-black py-2 px-16">{post.userName}</td>
                        <td className="border border-black py-2 px-16">{post.email}</td>
                        <td className="border border-black py-2 px-16">{dateToString(post.createdAt!)}</td>
                    </tr>
                }
            )}
            </tbody>
        </table>
        <Pagination/>
    </div>
};