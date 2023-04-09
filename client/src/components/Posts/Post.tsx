import React, {FC, useEffect, useState} from 'react';
import {useReactiveVar} from '@apollo/client';

import {PostType} from '../../types';
import {setAllPosts, setPostParentId} from '../../cache';
import {dateToString} from '../../utils/dateToString';

export const Post: FC<{ post: PostType }> = ({post}) => {
    const [parentPost, setParentPost] = useState<PostType | undefined>(undefined);
    const allPosts = useReactiveVar(setAllPosts);
    const [isView, setIsView] = useState<boolean>(false);

    const host = 'http://localhost:7000';

    useEffect(() => {
        if (post.parentId) {
            allPosts.map(p => {
                if (post.parentId === p.id) {
                    setParentPost(p);

                }
            });
        }
    }, [parentPost, allPosts, post]);

    return <div className={`${post.parentId && 'ml-20'} ${parentPost?.parentId && 'ml-40'} text-center mx-auto my-10`}>
        <div className="text-1xl flex text-black bg-gray-200 text-left p-3">
            <img className="h-10 mr-2"
                 src="http://localhost:7000/uploads/21ce9bbfb385a5298794b37222b6e86f.jpg" alt=""/>
            <span className="mt-2 font-bold">{post.userName}</span>
            <span className="mt-2 ml-2">{dateToString(post.createdAt || new Date())}</span>
            <button onClick={() => {
                setPostParentId(post.id);
                setTimeout(() => {
                    window.scrollTo({
                        top: 10000,
                        left: 0,
                        behavior: 'smooth',
                    });
                }, 30);
            }}
                    className="px-2 h-8 hover:bg-blue-400 duration-300 mr-2 bg-blue-300 mx-auto rounded-[5px]">
                Comment
            </button>
        </div>
        {parentPost &&
            <div
                className="border-l-[3px] my-2 text-[14px] text-left pl-2 border-blue-300 whitespace-nowrap overflow-hidden mt-2">
                {parentPost.text}
            </div>
        }
        <div className="text-left text-[14px] text-black" dangerouslySetInnerHTML={{__html: post.text}}/>
        {post.file && post.file.indexOf('.txt') >= 0 &&
            <iframe src={post.file.indexOf('blob') >= 0 ? post.file.replace('.txt', '') : host + post.file}></iframe>}
        {post.file && post.file.indexOf('.txt') < 0 &&
            <img onClick={() => setIsView(!isView)}
                 className={`duration-500 cursor-pointer ${isView ? 'w-[600px]' : 'w-[300px]'}`}
                 src={post.file.indexOf('blob') >= 0 ? post.file.replace('.txt', '') : host + post.file} alt="File"/>}
    </div>
};