import React, { useState, useRef, useEffect, memo } from 'react';
import '@/styles/course.manage.scss'
import UpArrow from '@/assets/Icons/UpArrow';
import DownArrow from '@/assets/Icons/DownArrow';
import { callFetchCourse } from '@/config/api';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IChapter } from '@/types/backend';
import './ClientCourseMenu.scss';

interface Props {
    courseId: number;
    contentId: number
    chapterId: number
}

const ClientCourseMenu: React.FC<Props> = memo(({ courseId, contentId, chapterId }) => {
    const rightMenuRef = useRef<HTMLDivElement>(null);
    const menuScrollRef = useRef<HTMLDivElement>(null);
    const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
    const [arrayChapter, setArrayChapter] = useState<IChapter[]>([]);
    const [courseLoaded, setCourseLoaded] = useState(false);
    const location = useLocation();
    const isOpenLesson = location.pathname.includes('admin/course-manage/lesson');
    const isEditLesson = location.pathname.includes('/lesson/edit');
    const isOpenNewChapter = location.pathname.includes('/chapter/lesson');
    const navigate = useNavigate();

    const handleLessonClick = (lessonId: number) => {
        navigate(`lesson/${lessonId}`);
    }

    useEffect(() => {
        if (courseLoaded && (isOpenLesson || isEditLesson)) {
            setTimeout(() => {
                const openingLesson = document.querySelector('.lesson-opening');
                if ((openingLesson) && rightMenuRef.current) {
                    const scrollPosition = openingLesson.getBoundingClientRect().top;
                    //@ts-ignore
                    const rightTop = rightMenuRef.current.getBoundingClientRect().top;
                    //@ts-ignore
                    menuScrollRef.current.scrollTop += scrollPosition - rightTop - 56;
                }
            })
        }
        if (courseLoaded && isOpenNewChapter) {
            const openingChapter = document.querySelector('.chapter-opening');
            if (openingChapter && rightMenuRef.current) {
                const scrollPosition = openingChapter.getBoundingClientRect().top;
                //@ts-ignore
                const rightTop = rightMenuRef.current.getBoundingClientRect().top;
                //@ts-ignore
                menuScrollRef.current.scrollTop += scrollPosition - rightTop - 55;
            }
        }
    }, [courseLoaded])

    useEffect(() => {
        const getCourse = async (id: number) => {
            if (id !== 0) {
                const res = await callFetchCourse(id);
                if (res?.data?.chapters) {
                    setArrayChapter(res.data.chapters);
                    setCourseLoaded(true);
                }
            }
        }
        getCourse(courseId);
        setOpenSections({ [chapterId]: true });
    }, [courseId])


    const handleScrollMenu = (event: React.MouseEvent<HTMLElement>, id: string, openStatus: boolean = false) => {
        const target = event.currentTarget;
        if (target && rightMenuRef.current) {
            const scrollPosition = target.getBoundingClientRect().top;
            //@ts-ignore
            const rightTop = rightMenuRef.current.getBoundingClientRect().top;
            if (menuScrollRef.current instanceof HTMLDivElement) {
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
                        lessons.forEach((item) => {
                            if (item.classList.contains('lesson-opening')) {
                                item.classList.remove('lesson-opening');
                            }
                        });
                    }
                    target.classList.add('lesson-opening');
                }
            }
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
                } else {
                    if (rightMenuRef.current) {
                        //@ts-ignore
                        if (rightMenuRef.current.style.top !== '0px') {
                            //@ts-ignore
                            rightMenuRef.current.style.top = '0px';
                        }
                    }
                    if (menuScrollRef.current instanceof HTMLDivElement) {
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
    }, [])

    return (
        <>
            <div
                ref={rightMenuRef}
                className='course-menu'
                style={{ top: 60 }}
            >
                <div className='menu-close'>
                    Course
                </div>
                <div
                    className='menu-container'
                    ref={menuScrollRef}
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 60px - 55px)',
                        boxSizing: 'border-box',
                        overflowY: 'auto',
                        background: 'white',
                    }}
                >
                    <div
                        className='menu-content'
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            paddingLeft: '1px',
                            backgroundColor: '#f7f9fa',
                            overflowX: 'hidden'
                        }}
                    >
                        {
                            //@ts-ignore
                            arrayChapter.length > 0 && arrayChapter.map((c, cIndex) => (
                                <div className='chapter' key={c.id}>
                                    <div
                                        className={`chapter-title client-custom ${isOpenNewChapter && chapterId === c.id ? 'chapter-opening' : ''}`}
                                        onClick={(e) => {
                                            setOpenSections((prev) => {
                                                const copyState = prev;
                                                return {
                                                    ...copyState,
                                                    [c.id]: !copyState[c.id],
                                                }
                                            })
                                            handleScrollMenu(e, "chapter", openSections[c.id]);
                                        }}
                                    >
                                        {`Chapter ${cIndex > 0 ? cIndex + 1 : '0' + (cIndex + 1).toString()}: ${c.title}`}
                                        {openSections[c.id] ? <span className='up-arrow'><UpArrow /></span> : <span className="down-arrrow"><DownArrow /></span>}
                                    </div>
                                    <div
                                        className='chapter-lesson'
                                        style={{
                                            display: openSections[c.id] ? "block" : "none",
                                        }}
                                    >
                                        <ul>
                                            {c.lessons.map((l, lIndex) =>
                                                <li
                                                    className={`lesson-title lesson-title-client-custom ${(isOpenLesson && l.contentId === contentId) ? 'lesson-opening' : ''}`}
                                                    key={l.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLessonClick(l.id);
                                                        handleScrollMenu(e, 'lesson')
                                                    }}
                                                >
                                                    {`${cIndex * 10 + lIndex + 1}. ${l.title}`}
                                                    {!l.linkVideo &&
                                                        <span
                                                            className='client-lesson-action'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open('https://www.youtube.com/watch?v=g5glqul5ANQ&ab_channel=Ch%C3%A1nhKi%E1%BA%BFnVi%E1%BB%87tNg%E1%BB%AF', '_blank', 'noopener,noreferrer');
                                                            }}
                                                        >
                                                            Video
                                                        </span>
                                                    }

                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
})

export default ClientCourseMenu;