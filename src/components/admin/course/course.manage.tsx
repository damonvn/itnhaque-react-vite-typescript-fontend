import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Styles for Quill Editor
import { Form, Input, Button } from 'antd';

import 'highlight.js/styles/monokai.css';
import hljs from 'highlight.js';
import '@/styles/course.manage.scss'
import CopyIcon from '@/assets/CopyIcon';
import { callCreateLesson, callFetchLesson } from '@/config/api';
import UpArrow from '@/assets/Icons/UpArrow';
import DownArrow from '@/assets/Icons/DownArrow';


const modules = {
    syntax: {
        //@ts-ignore
        highlight: (text) => {
            const hlight = hljs.highlightAuto(text).value;
            return hlight;
        },
    },
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
    ],
}

const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'link', 'code-block'
];

const arrayTitle: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const arrayLesson: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CourseManage = () => {
    const quillRef = useRef(null);
    const rightMenuRef = useRef(null);
    const menuScrollRef = useRef(null);
    const [editorValue, setEditorValue] = useState(''); // Giá trị ban đầu
    const [title, setTitle] = useState('');
    const [feContent, setFeContent] = useState('');


    const keyExam: string = '1';
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ [keyExam]: true });
    console.log("check openSections[1]: ", openSections['1']);
    const [openingLesson, setOpeningLesson] = useState<{ [key: string]: boolean }>({});

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



    const handleOnchange = (value: any) => {
        setEditorValue(value);
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
            // setTitle(`${res.data.title} (from database)`);
            const innerHTML = addedButtonHTML(res.data.content);
            setFeContent(innerHTML);
        }
    }

    const handleScrollLessson = (element: HTMLElement) => {
        const scrollPosition = element.getBoundingClientRect().top;
        //@ts-ignore
        const rightTop = rightMenuRef.current.getBoundingClientRect().top;

        setTimeout(() => {
            //@ts-ignore
            menuScrollRef.current.scrollTop = scrollPosition - rightTop - 56;
        });

    }

    useEffect(() => {
        const liOpen = window.document.querySelector('.lesson-opening')
        if (liOpen) {
            //@ts-ignore
            handleScrollLessson(liOpen);
        }
    }, [])

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
                style={{ width: '62%', textAlign: 'center', padding: '0 15px', height: '5000px', boxSizing: 'border-box' }}
            >
                <Input onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <ReactQuill
                    value={editorValue} // Truyền giá trị ban đầu vào đây
                    modules={modules}
                    formats={formats}
                    onChange={handleOnchange}
                    ref={quillRef}
                />
                <Button
                    //@ts-ignore
                    onClick={() => handleRenderHTML()}
                    style={{ marginTop: '20px' }}
                >
                    Click Here
                </Button>
                <div
                    className='client-ql-editor'
                    dangerouslySetInnerHTML={{ __html: feContent }}
                />
            </div >
            <div
                ref={rightMenuRef}
                style={{
                    width: '38%',
                    position: 'fixed',
                    top: 60,
                    right: 0,
                    boxSizing: 'border-box',
                    borderLeft: '1px solid #cccccc',
                    backgroundColor: '#f7f9fa',
                }}
            >
                <div
                    style={{
                        height: '55px',
                        lineHeight: '55px',
                        textAlign: 'center',
                        background: '#fff',
                        boxSizing: 'border-box',
                        border: '1px solid #cccccc'
                    }}>
                    Course
                </div>
                <div
                    ref={menuScrollRef}
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 60px - 55px)',
                        boxSizing: 'border-box',
                        overflowY: 'auto',
                        background: 'white'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            paddingLeft: '1px',
                            backgroundColor: '#f7f9fa'
                        }}
                    >
                        {
                            arrayTitle.map((t) => (
                                <div className='chapter' key={t}>
                                    <div
                                        className='chapter-title'
                                        style={{
                                            backgroundColor: '#f7f9fa',
                                            minHeight: '65px'
                                        }}
                                        onClick={(e) => {
                                            setOpenSections((prev) => {
                                                const copyState = prev;
                                                return {
                                                    ...copyState,
                                                    [t.toString()]: !copyState[t.toString()],
                                                }
                                            })
                                            handleScrollMenu(e, "chapter", openSections[t.toString()]);
                                        }}
                                    >
                                        Chapter {t < 10 ? `0${t}` : t} {/* Định dạng tiêu đề cho 2 chữ số */}
                                        <span>{openSections[t.toString()] ? <UpArrow /> : <DownArrow />}</span>
                                    </div>
                                    <div
                                        className='chapter-lesson'
                                        style={{
                                            display: openSections[t.toString()] ? "block" : "none",
                                        }}
                                    >
                                        <ul>
                                            {arrayLesson.map((l) => (
                                                <li
                                                    className={`lesson-title ${t === 1 && l === 5 ? 'lesson-opening' : ''}`}
                                                    key={t + '-' + l}
                                                    onClick={(e) => {
                                                        const liKey = t.toString() + l.toString();
                                                        setOpeningLesson({ liKey: true })
                                                        handleScrollMenu(e, 'lesson')
                                                    }}
                                                >
                                                    {`Lesson ${(t - 1) * 10 + l}`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
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
                block.appendChild(btn)
            }
        });
    }
    return div.innerHTML;
}

