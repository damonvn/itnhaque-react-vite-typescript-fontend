import React, { useState, useRef, useEffect } from 'react';

import 'react-quill/dist/quill.snow.css';  // Styles for Quill Editor
import 'highlight.js/styles/monokai.css';
import '@/styles/course.manage.scss'

import { callFetchContent } from '@/config/api';
import QuillEditor from './QuillEditor';
import CourseMemu from './CourseMenu';
import { IContent } from '@/types/backend';
import { useLocation, useParams } from 'react-router-dom';
import CopyIcon from '@/assets/CopyIcon';

const initialContent: IContent = {
    id: 0,
    courseId: 0,
    chapterId: 0,
    lessonId: 0,
    title: '',
    content: ''
}

const CourseManage = () => {
    const rightMenuRef = useRef(null);
    const menuScrollRef = useRef(null);
    const [courseId, setCourseId] = useState<number>(0)
    const [lessonContent, setLessonContent] = useState<IContent>(initialContent);

    const location = useLocation();
    const isEditLesson = location.pathname.includes('/lesson/edit');

    const { id } = useParams();

    const getLesson = async (contentId: number) => {
        const res = await callFetchContent(contentId);
        if (res && res.data) {
            setCourseId(res.data.courseId);
            setLessonContent(res.data);
        }
    }

    useEffect(() => {
        //@ts-ignore
        getLesson(+id);
    }, [id])

    const innerHTML = addedButtonHTML(lessonContent.content);

    useEffect(() => {
        const handleScroll = () => {
            if (rightMenuRef.current) {
                if (window.scrollY <= 60) {
                    if (rightMenuRef.current) {
                        //@ts-ignore
                        rightMenuRef.current.style.top = `${60 - window.scrollY}px`;
                    }
                    //@ts-ignore
                    menuScrollRef.current.style.height = `calc(100vh - 60px - 55px + ${window.scrollY}px)`;
                    //@ts-ignore
                    console.log('menuScrollRef.current.style.height: ', menuScrollRef.current.style.height)

                    // if (menuScrollRef.current) {
                    //     //@ts-ignore
                    //     menuScrollRef.current.style.height = `${menuScrollRef.current.style.clientHeight + window.scrollY}px`;
                    //     //@ts-ignore
                    //     console.log('menuScrollRef.current.style.height: ', menuScrollRef.current.style.height)
                    // }

                } else {
                    if (rightMenuRef.current) {
                        //@ts-ignore
                        if (rightMenuRef.current.style.top !== '0px') {
                            //@ts-ignore
                            rightMenuRef.current.style.top = '0px';
                        }
                    }
                    if (menuScrollRef.current) {
                        //@ts-ignore
                        if (menuScrollRef.current.style.height !== 'calc(100vh - 55px)') {
                            //@ts-ignore
                            menuScrollRef.current.style.height = 'calc(100vh - 55px)';
                        }
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove the event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    useEffect(() => {
        const handleLessonScroll = () => {
            const codeBlocks = document.querySelectorAll('.admin-lesson-content .ql-syntax');
            const lessonBlock = document.querySelector('.admin-lesson-content');
            if (codeBlocks.length > 0 && lessonBlock) {
                //@ts-ignore
                const lessonBlockLeft = lessonBlock.getBoundingClientRect().left;
                //@ts-ignore
                const lessonBlockWidth = lessonBlock.getBoundingClientRect().width;


                codeBlocks.forEach(codeBlock => {
                    const copyBTN = codeBlock.querySelector('.copy-btn');
                    if (copyBTN) {
                        const bottom = codeBlock.getBoundingClientRect().bottom;
                        //@ts-ignore
                        copyBTN.style.transition = 'opacity 0.05s ease';
                        console.log('check bottom: ', bottom);
                        if (bottom > 40) {
                            //@ts-ignore
                            if (copyBTN.style.opacity !== 1) {
                                //@ts-ignore
                                copyBTN.style.opacity = 1;
                            }
                            const top = codeBlock.getBoundingClientRect().top
                            console.log('check top: ', top);
                            if (top <= 0) {
                                //@ts-ignore
                                if (copyBTN.style.position !== 'fixed') {
                                    //@ts-ignore
                                    copyBTN.style.position = 'fixed';
                                    //@ts-ignore
                                    copyBTN.style.top = '6px';
                                    //@ts-ignore
                                    copyBTN.style.left = `${lessonBlockLeft + lessonBlockWidth - 8 - 105}px`;
                                    //@ts-ignore
                                    copyBTN.style.right = 'auto';
                                }
                            } else {
                                //@ts-ignore
                                if (copyBTN.style.position === 'fixed') {
                                    //@ts-ignore
                                    copyBTN.style.position = 'absolute';
                                    //@ts-ignore
                                    copyBTN.style.top = '6px';
                                    //@ts-ignore
                                    copyBTN.style.left = 'auto'
                                    //@ts-ignore
                                    copyBTN.style.right = '8px';
                                }
                            }
                        } else {
                            //@ts-ignore
                            // if (copyBTN.style.visibility !== 'hidden') {
                            //     //@ts-ignore
                            //     copyBTN.style.visibility = 'hidden';
                            // }
                            if (copyBTN.style.opacity !== 0) {
                                //@ts-ignore
                                copyBTN.style.opacity = 0;
                            }
                        }

                    }
                });
            }
        };

        // Gán sự kiện scroll cho window
        window.addEventListener('scroll', handleLessonScroll);

        // Cleanup sự kiện khi component bị unmount
        return () => {
            window.removeEventListener('scroll', handleLessonScroll);
        };

    }, [])

    return (
        <div
            className='admin-course-manager'
        >
            <header className='header'></header>
            <div
                style={{ width: '70%', textAlign: 'center', padding: '0 15px', height: '5000px', boxSizing: 'border-box' }}
            >
                <div style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>

                    {
                        isEditLesson ?
                            <>
                                {/* <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', marginBottom: '6px', marginTop: '14px    ' }}><span style={{ color: 'red' }}>*</span> Title</label>
                                <Input
                                    value={lessonTitle}
                                    onChange={(e) => {
                                        setLessonTitle(e.target.value);
                                    }}
                                /> */}
                                {
                                    lessonContent.id !== 0 &&
                                    <QuillEditor
                                        id={lessonContent.id}
                                        title={lessonContent.title}
                                        content={lessonContent.content}
                                        courseId={lessonContent.courseId}
                                        chapterId={lessonContent.chapterId}
                                        lessonId={lessonContent.lessonId}
                                    />
                                }
                            </>
                            :
                            <div
                                style={{ textAlign: 'left', marginTop: '10px' }}
                                className='admin-lesson-content'
                                dangerouslySetInnerHTML={{ __html: innerHTML }}
                            />


                    }
                </div>
            </div >
            <CourseMemu courseId={courseId} chapterId={lessonContent.chapterId} contentId={lessonContent.id} />
        </div >
    );
}

export default CourseManage;

const addedButtonHTML = (innerHTML: string) => {
    const div = document.createElement('div')
    div.innerHTML = innerHTML;
    const blocks = div.querySelectorAll('.ql-syntax');
    if (blocks.length > 0) {
        //@ts-ignore
        blocks.forEach((block) => {
            if (!block.classList.contains('copy-btn')) {
                const btn = document.createElement('button');
                btn.className = 'copy-btn';
                btn.style.position = 'absolute';
                btn.style.top = '6px';
                btn.style.right = '8px';
                btn.style.width = '105px';
                btn.style.height = '26px';
                btn.style.display = 'flex';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.borderRadius = '4px';
                const btnIcon = document.createElement('span');
                btnIcon.style.marginRight = '5px';
                btnIcon.style.paddingTop = '2.5px';
                btnIcon.innerHTML = CopyIcon();
                const btnTxt = document.createElement('span');
                btnTxt.textContent = 'Copy code';
                btnTxt.style.fontSize = '12px';
                btn.appendChild(btnIcon);
                btn.appendChild(btnTxt);
                //@ts-ignore
                block.style.position = 'relative';
                block.appendChild(btn);
            }
        });
    }
    return div.innerHTML;
}
