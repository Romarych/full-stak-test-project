import React, {FC, useState} from 'react';
import {PaginationType} from '../../types';
import {setCurrentPage, setTotalPostsCount} from '../../cache';
import {useReactiveVar} from '@apollo/client';

export const Pagination: FC<PaginationType> = ({pageSize = 25, portionSize = 25}) => {
    const currentPage = useReactiveVar(setCurrentPage);
    const totalItemsCount = useReactiveVar(setTotalPostsCount);

    const pagesCount = Math.ceil(totalItemsCount / pageSize);
    const pages: Array<number> = [];
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    const portionCount = Math.ceil(pagesCount / portionSize);
    const [portionNumber, setPortionNumber] = useState(1);
    const leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
    const rightPortionPageNumber = portionNumber * portionSize;

    return <div className="text-center mb-4">
            {portionNumber > 1 && <button className="bg-amber-400 py-1 px-2 mx-1 rounded-[3px] text-black" onClick={() => setPortionNumber(portionNumber - 1)}>Prev</button>}
            {pages.filter(p => p >= leftPortionPageNumber && p <= rightPortionPageNumber).map((p) =>
                <button className={`${currentPage === p ? 'bg-amber-600' : 'bg-amber-400'} text-black mx-1 py-1 px-2 rounded-[3px]`}
               key={p} onClick={(e) => {
                   // onPageChanged(p);
                   setCurrentPage(p);
               }}>{p}</button>
            )}
            {portionCount > portionNumber && <button  className="bg-amber-400 py-1 px-2 mx-1 rounded-[3px] text-black" onClick={() => setPortionNumber(portionNumber + 1)}>Next</button>}
        </div>
};