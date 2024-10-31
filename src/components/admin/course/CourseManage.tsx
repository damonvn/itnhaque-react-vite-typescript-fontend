import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Styles for Quill Editor
import { Form, Input, Button } from 'antd';
import { DeleteFilled, DeleteOutlined, DownOutlined, EditOutlined, MergeCellsOutlined, PlusSquareOutlined, RetweetOutlined, SwapOutlined, UpOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';


import 'highlight.js/styles/monokai.css';
import hljs from 'highlight.js';
import '@/styles/course.manage.scss'
import CopyIcon from '@/assets/CopyIcon';
import { callCreateLesson, callFetchLesson } from '@/config/api';
import UpArrow from '@/assets/Icons/UpArrow';
import DownArrow from '@/assets/Icons/DownArrow';
import QuillEditor from './QuillEditor';
import CourseMemu from './CourseMenu';

const arrayTitle: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const arrayLesson: number[] = [1, 2, 3, 4, 5, 6, 7];


const LessonTitle = () => {
    const [title, setTitle] = useState('');
    useEffect(() => {
        // Gọi API lấy dữ liệu từ database
        setTitle('Title from database')
    }, [])
    return (
        <>
            <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', marginBottom: '6px', marginTop: '14px    ' }}><span style={{ color: 'red' }}>*</span> Title</label>
            <Input
                value={title}
                onChange={(e) => {
                    console.log('check e: ', e.target.value);
                    setTitle(e.target.value);
                }}
            />
        </>
    );
}

const CourseManage = () => {
    const rightMenuRef = useRef(null);
    const menuScrollRef = useRef(null);
    const [feContent, setFeContent] = useState('');
    const keyExam: string = `1`;
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ ['1']: true });
    const [openingLesson, setOpeningLesson] = useState<{ [key: string]: boolean }>({});
    const [lessonTitle, setLessonTitle] = useState('');
    const handleSetTitle = (value: string) => {
        setLessonTitle(value);
    }

    const handleScrollMenu = (event: React.MouseEvent<HTMLElement>, id: string, openStatus: boolean = false) => {
        const target = event.currentTarget;
        if (target && rightMenuRef.current) {
            setTimeout(() => {
                const scrollPosition = target.getBoundingClientRect().top;
                //@ts-ignore
                const rightTop = rightMenuRef.current.getBoundingClientRect().top;
                if (menuScrollRef.current) {
                    if (id === "chapter") {
                        if (!openStatus) {
                            //@ts-ignore
                            menuScrollRef.current.scrollTop += scrollPosition - rightTop - 55;
                        }
                    } else if (id === "lesson") {
                        //@ts-ignore
                        menuScrollRef.current.scrollTop += scrollPosition - rightTop - 56;
                        const lessons = document.querySelectorAll('.chapter-lesson .lesson-title');
                        if (lessons.length > 0) {
                            lessons.forEach((item, index) => {
                                if (item.classList.contains('lesson-opening')) {
                                    item.classList.remove('lesson-opening');
                                }
                            });
                        }
                        target.classList.add('lesson-opening');
                    }
                }
            })
        }
    }


    const handleRenderHTML = async () => {
        // const lesson = {
        //     'title': title,
        //     'content': quillContent
        // }

        // const res = (await callCreateLesson(lesson)).data;
        // if (res?.data) {
        //     setTitle(`${res.data.title} (from database)`);
        //     setEditorValue(res.data.content);
        // }

        const res = (await callFetchLesson(6)).data;
        if (res?.data?.content) {
            const innerHTML = addedButtonHTML(res.data.content);
            setFeContent(innerHTML);
        }
    }

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
    })

    return (
        <div
            className='admin-course-manager'
        >
            <header className='header'></header>
            <div
                style={{ width: '70%', textAlign: 'center', padding: '0 15px', height: '5000px', boxSizing: 'border-box' }}
            >
                <div style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <LessonTitle />
                    <QuillEditor />
                </div>
            </div >
            <CourseMemu />
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

