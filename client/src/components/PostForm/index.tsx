import {ErrorMessage, Field, Form, Formik, FormikHelpers} from 'formik';
import React, {FC, useEffect, useState} from 'react';
import {useMutation, useReactiveVar} from '@apollo/client';

import {CREATE_POST} from '../../graphq/mutation/createPost';
import {PostType} from '../../types';
import {setAllPosts, setCurrentPage, setPostParentId} from '../../cache';

export const PostForm: FC = () => {
    const [newPost] = useMutation(CREATE_POST);
    const allPosts = useReactiveVar(setAllPosts);
    const postParentId = useReactiveVar(setPostParentId);
    const currentPage = useReactiveVar(setCurrentPage);

    const [file, setFile] = useState<File | undefined>();
    const [tag, setTag] = useState<string>('');
    const [textarea, setTextarea] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [captcha, setCaptcha] = useState<any>('');
    const [isForm, setIsForm] = useState<boolean>(false);
    const [errorCaptcha, setErrorCaptcha] = useState<string>('');
    const [valueCaptcha, setValueCaptcha] = useState<string>('');
    const [isSubmit, setIsSubmit] = useState<boolean>(true);
    const [isEdit, setIsEdit] = useState<boolean>(true);

    const tags = ["a", "code", "i", "strong"];
    const host = 'http://localhost:7000';
    const wsHost = 'ws://localhost:7000/'

    const socket = new WebSocket(wsHost)

    useEffect(() => {
        tag && setTextarea(textarea + tag);
        setTag('');
        postParentId && setIsForm(true);
    }, [tag, textarea, postParentId]);

    useEffect(() => {
        getCaptcha();
    }, []);

    useEffect(() => {
        socket.onmessage = ({data}) => {
            try {
                const post = JSON.parse(data);
                addPost(post, allPosts);
            } catch (e) {
                console.log('Error --->', e);
            }
        }
    }, []);

    useEffect(() => {
        if (!isForm && allPosts?.length > 25) {
            let posts = allPosts;
            if (posts.length > 25) posts = posts.filter((post, index) => index != 0);
            setAllPosts(posts);
        }
    }, [isForm, allPosts]);

    const submit = async (values: PostType, {setSubmitting}: FormikHelpers<PostType>) => {
        if (isSubmit) {
            const captchaData = await postCaptcha(values.captcha);
            if (captchaData.error) {
                setIsEdit(true);
                return setErrorCaptcha(captchaData.error);
            } else {
                setIsForm(false);
            }
            const fileData = file ? await uploadFile(file) : '';
            if (fileData.error) return console.log(fileData.error);
            const {data} = await newPost({
                variables: {
                    input: {
                        parentId: postParentId,
                        userName: values.userName,
                        text: values.text,
                        homePage: values.homePage,
                        email: values.email,
                        file: fileData || undefined
                    }
                }
            })
            if (data) {
                setIsEdit(true);
                setPostParentId('');
                setFile(undefined);
                setTextarea('');
                const newPost = JSON.stringify(data.createPost)
                socket.send(newPost);
            }

            if (currentPage === 1) {
                addPost(data.createPost, allPosts);
            } else {
                setCurrentPage(1);
            }
            setSubmitting(false);
        } else {
            if (currentPage === 1) {
                let posts = allPosts;
                if (posts.length > 25) posts = posts.filter((post, index) => index != 0);
                const url = file ? URL.createObjectURL(file as unknown as Blob) : '';
                setAllPosts([{
                    parentId: postParentId,
                    userName: values.userName,
                    file: url,
                    homePage: values.homePage,
                    text: values.text,
                    email: values.email,
                    captcha: values.captcha
                }, ...posts]);
            } else {
                setCurrentPage(1);
            }
        }

    }

    const formValidate = (values: PostType) => {
        valueCaptcha != values.captcha && setErrorCaptcha('');
        setValueCaptcha(values.captcha);
        setText(values.text);
        if (text != values.text && !tag) setTextarea(values.text);
        const errors: any = {};
        if (!values.userName) {
            errors.userName = 'Required';
        }
        if (values.homePage && !/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(values.homePage)) {
            errors.homePage = 'Invalid url';
        }
        if (!values.email) {
            errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        if (!values.captcha) {
            errors.captcha = 'Required';
        }
        if (!values.text) {
            errors.text = 'Required';
        } else {
            const text = values.text as any;
            const a = text.indexOf('>') >= 0 ? text.match(/['>']/g ).length : 0;
            const b = text.indexOf('<') >= 0 ? text.match(/['<']/g).length : 0;
            if (a || b) {
                if (!(a % 2 == 0) || !(b % 2 == 0) || a !== b) {
                    errors.text = 'Close tag';
                } else {
                    values.text.replace(/<(\/?)([a-z]+)[^>]*(>|$)/gi, function (match, slash, tag) {
                        if (["a", "code", "i", "strong"].indexOf(tag) < 0) {
                            errors.text = 'Remove unresolved tags';
                            return '';
                        }
                        return match;
                    });
                }
            }
        }
        if (file && file.size > 100000 && file.type == 'text/plain') {
            errors.file = 'File must be less than 100KB';
        }
        return errors;
    }

    const addPost = (post: PostType, posts: PostType[]) => {
        if (posts.length > 25) posts = posts.filter((post, index) => index != 0);
        posts = posts.filter((post, index) => index != 24);
        setAllPosts([post, ...posts]);
    }

    const postCaptcha = async (value: string) => {
        const response = await fetch(`${host}/captcha`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                captcha: value
            })
        });
        let data = await response.json();
        return data;
    }

    const getCaptcha = async () => {
        const response = await fetch(`${host}/captcha`, {
            credentials: 'include'
        });
        let blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setCaptcha(url);
    }

    const uploadFile = async (file: File | undefined) => {
        const formData = new FormData();
        formData.append("file",  file as unknown as Blob);
        const response = await fetch(`${host}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data;
    }

    return (
        <div className="w-1/2 mx-auto mb-4">
            {isForm &&
                <Formik
                    enableReinitialize
                    initialValues={{userName: '', text: '', homePage: '', email: '', captcha: ''}}
                    validate={formValidate}
                    onSubmit={submit}
                >
                    {({isSubmitting}) => (
                        <Form className="max-w-[300px] mx-auto">
                                <div className={isEdit ? '' : 'hidden'}>
                                    <Field placeholder='Name' type="text" name='userName'
                                           className="w-full h-10 pl-2 block mx-auto mt-5 border border-black rounded-[5px]"/>
                                    <ErrorMessage name="userName" component="div"
                                                  className="w-full text-left text-red-600 w-1/4 mx-auto"/>
                                    <Field placeholder="Email" type="email" name='email'
                                           className="w-full h-10 pl-2 block mx-auto mt-5 border border-black rounded-[5px]"/>
                                    <ErrorMessage name="email" component="div"
                                                  className="w-full text-left text-red-600 w-1/4 mx-auto"/>
                                    <Field placeholder="https://example.com" type="text" name='homePage'
                                           className="w-full block mx-auto h-10 pl-2 mt-5 border border-black rounded-[5px]"/>
                                    <ErrorMessage name="homePage" component="div"
                                                  className="w-full text-left text-red-600 w-1/4 mx-auto"/>
                                    <div className="text-center">
                                        {tags.map(tag =>
                                            <button type="button" key={tag} onClick={(e) => {
                                                setTag(`<${tag}${tag === 'a' ? ' href=”” title=””' : ''}></${tag}>`)
                                            }}
                                                    className="px-4 mr-2 mb-[-20px] hover:bg-blue-400 duration-300 py-1 bg-blue-300 mx-auto my-5 rounded-[5px]">[{tag}]</button>
                                        )}
                                    </div>
                                    <Field placeholder='Text' component='textarea' type='text' value={textarea}
                                           name='text'
                                           className='w-full block mx-auto mt-5 h-20 pl-2 border border-black rounded-[5px]'/>
                                    <ErrorMessage name="text" component="div"
                                                  className="w-full text-left text-red-600 w-1/4 mx-auto"/>
                                    <Field
                                        onChange={(e: { target: { files: React.SetStateAction<File | undefined>[]}}) => setFile(e.target.files[0])}
                                        placeholder="Upload file" type="file" name='file'
                                        accept="image/png, image/jpeg, image/gif, text/plain"
                                        className="mx-auto mt-5 w-full border border-black rounded-[5px]"/>
                                    <ErrorMessage name="file" component="div"
                                                  className="w-full text-left text-red-600 w-1/4 mx-auto"/>
                                    <div className="mx-auto mt-4 flex justify-between">
                                        <img src={captcha}/>
                                        <button type="button" onClick={() => {
                                            getCaptcha();
                                        }}
                                                className="px-2 hover:bg-blue-600 duration-300 bg-blue-700 block py-1 text-white mr-4 mt-8 my-5 rounded-[5px]"
                                        >
                                            Refetch
                                        </button>
                                    </div>
                                    <Field placeholder="Captcha" type="text" name='captcha'
                                           className="w-full block mx-auto h-10 pl-2 mt-5 border border-black rounded-[5px]"/>
                                    <ErrorMessage name="captcha" component="div"
                                                  className="w-full text-left text-red-600 w-1/4 mx-auto"/>
                                    {errorCaptcha &&
                                        <div
                                            className="w-full text-left text-red-600 w-1/4 mx-auto">{errorCaptcha}</div>}
                                </div>
                            <button onClick={() => {
                                setIsSubmit(false);
                                setIsEdit(!isEdit);
                            }}
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-[45%] hover:bg-gray-500 bg-gray-400 inline-block duration-300 bg-amber-500 disabled:bg-amber-200 hover:bg-amber-600 h-10 block mx-auto my-5 rounded-[5px]">
                                {isEdit ? 'Preview' : 'Edit'}
                            </button>
                            <button onClick={() => {
                                setIsSubmit(true);
                            }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-[45%] inline-block duration-300 bg-amber-500 ml-2 disabled:bg-amber-200 hover:bg-amber-600 h-10 block mx-auto my-5 rounded-[5px]">
                                Send
                            </button>
                        </Form>
                    )}
                </Formik>
            }
            <div className="mb-4">
            </div>
            <button onClick={() => {
                setIsForm(!isForm);
                getCaptcha();
                setIsEdit(true);
                setPostParentId('');
                setTimeout(() => {
                    window.scrollTo({
                        top: 10000,
                        left: 0,
                        behavior: 'smooth',
                    });
                }, 30)
            }}
                    className="px-4 mr-4 hover:bg-blue-400 duration-300 block mr-[-50%] py-2 text-center bg-blue-300 mx-auto rounded-[5px]">
                {isForm ? 'Cancel' : 'Add post'}
            </button>
        </div>
    );
};