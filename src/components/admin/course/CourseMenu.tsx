import React, { useState, useRef, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, MergeCellsOutlined, PlusSquareOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';



import '@/styles/course.manage.scss'
import UpArrow from '@/assets/Icons/UpArrow';
import DownArrow from '@/assets/Icons/DownArrow';

const arrayTitle: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const arrayLesson: number[] = [1, 2, 3, 4, 5, 6, 7];


const CourseMemu = () => {
    const rightMenuRef = useRef(null);
    const menuScrollRef = useRef(null);
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ ['1']: true });
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

    const handleScrollLessson = (element: HTMLElement) => {
        const scrollPosition = element.getBoundingClientRect().top;
        //@ts-ignore
        const rightTop = rightMenuRef.current.getBoundingClientRect().top;
        if (menuScrollRef.current) {
            //@ts-ignore
            menuScrollRef.current.scrollTop = scrollPosition - rightTop - 56;
        }
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
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    })

    return (
        <div
            ref={rightMenuRef}
            style={{
                width: '30%',
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
                                    Chapter Viet Nam Hello That's I'm Which 111 1 Is The Country The Best The11 {t < 10 ? `0${t}` : t} {/* Định dạng tiêu đề cho 2 chữ số */}

                                    {openSections[t.toString()] ? <span className='up-arrow'><UpArrow /></span> : <span className="down-arrrow"><DownArrow /></span>}
                                    <div className='chapter-action'>
                                        <PlusSquareOutlined className='add' />
                                        <EditOutlined className='edit' />
                                        <DeleteOutlined className='delete' />
                                    </div>
                                </div>

                                <div
                                    className='chapter-lesson'
                                    style={{
                                        display: openSections[t.toString()] ? "block" : "none",
                                    }}
                                >
                                    <ul>
                                        {arrayLesson.map((l) => {
                                            if (arrayLesson.length === 1) {
                                                return (
                                                    <li
                                                        className={`lesson-title ${t === 1 && l === 5 ? 'lesson-opening' : ''}`}
                                                        key={t + '-' + l}
                                                        onClick={(e) => {
                                                            const liKey = t.toString() + l.toString();
                                                            setOpeningLesson({ [liKey]: true })
                                                            handleScrollMenu(e, 'lesson')
                                                        }}
                                                    >
                                                        {`Only One Lesson`}
                                                    </li>
                                                )
                                            } else {
                                                return (
                                                    <li
                                                        style={{
                                                            // display: 'flex',
                                                            // justifyContent: 'space-between',
                                                        }}
                                                        className={`lesson-title ${t === 1 && l === 5 ? 'lesson-opening' : ''}`}
                                                        key={t + '-' + l}
                                                        onClick={(e) => {
                                                            const liKey = t.toString() + l.toString();
                                                            setOpeningLesson({ [liKey]: true })
                                                            handleScrollMenu(e, 'lesson')
                                                        }}
                                                    >
                                                        {`Lesson ${(t - 1) * 10 + l}`}
                                                        <div
                                                            className='lesson-action'
                                                        >
                                                            <PlusSquareOutlined className='add' />
                                                            <EditOutlined className='edit' />
                                                            <MergeCellsOutlined className='swap' />
                                                            <DeleteOutlined className='delete' />
                                                            <VideoCameraAddOutlined className='lesson-video' />
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        })}
                                    </ul>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default CourseMemu;