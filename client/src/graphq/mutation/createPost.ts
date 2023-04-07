import {gql} from '@apollo/client';

export const CREATE_POST = gql`
    mutation($input: PostInput) {
        createPost(input: $input) {
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
    }
`;