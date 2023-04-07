import {gql} from '@apollo/client';

export const GET_ALL_POSTS = gql`
    query getAllPosts (
        $offset: Int 
        $limit: Int 
        $sortField: String 
        $sortIndex: String
    ) {
            getAllPosts (
                offset: $offset 
                limit: $limit 
                sortField: $sortField 
                sortIndex: $sortIndex
            ) {
                posts {
                    id
                    parentId
                    userName
                    text
                    email
                    homePage
                    photo
                    file  
                    createdAt
                }
                count
        }
    }
`;