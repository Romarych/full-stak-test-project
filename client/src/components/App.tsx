import React, {useState} from 'react';

import {Posts} from './Posts';
import {PostsTable} from './TablePosts';

function App() {
    const [isTablePosts, setIsTablePosts] = useState<boolean>(false);

    return <div className="text-1xl text-black text-center w-full">
        <button onClick={() => setIsTablePosts(!isTablePosts)}
                className="px-4 mt-10 py-2 hover:bg-blue-400 duration-300 text-center bg-blue-300 rounded-[5px]">
            {isTablePosts ? 'View posts' : 'View table posts'}
        </button>
        {isTablePosts ?
            <PostsTable/> :
            <Posts/>
        }
    </div>

};

export default App;
