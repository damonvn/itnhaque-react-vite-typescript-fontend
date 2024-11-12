import React, { useState, useRef, useEffect, memo } from 'react';
import { DeleteOutlined, EditOutlined, MergeCellsOutlined, PlusSquareOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import '@/styles/course.manage.scss'
import UpArrow from '@/assets/Icons/UpArrow';
import DownArrow from '@/assets/Icons/DownArrow';
import { callFetchCourse } from '@/config/api';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IChapter } from '@/types/backend';


interface Props {
    courseId: number;
    contentId: number
    chapterId: number
}




const CourseMenu: React.FC<Props> = memo(({ courseId, contentId, chapterId }) => {
    const rightMenuRef = useRef<HTMLDivElement>(null);
    const menuScrollRef = useRef<HTMLDivElement>(null);
    const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({ [0]: true });
    const [arrayChapter, setArrayChapter] = useState<IChapter[]>([]);
    const [courseLoaded, setCourseLoaded] = useState(false);


    const location = useLocation();
    const isEditLesson = location.pathname.includes('/lesson/edit');

    const navigate = useNavigate();
    const handleLessonClick = (lessonId: number) => {
        navigate(`/course-manage/lesson/${lessonId}`);
    }



    useEffect(() => {
        const getCourse = async (id: number) => {
            if (id !== 0) {
                const res = (await callFetchCourse(id)).data;
                if (res?.data?.chapters) {
                    setArrayChapter(res.data.chapters);
                }
                setCourseLoaded(true);
            }

        }
        getCourse(courseId);
    }, [courseId])

    useEffect(() => {
        if (courseLoaded && !isEditLesson) {
            const openingLesson = document.querySelector('.lesson-opening');
            if (openingLesson && rightMenuRef.current) {
                const scrollPosition = openingLesson.getBoundingClientRect().top;
                //@ts-ignore
                const rightTop = rightMenuRef.current.getBoundingClientRect().top;
                //@ts-ignore
                menuScrollRef.current.scrollTop += scrollPosition - rightTop - 56;
            }
        }
    }, [courseLoaded])

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
                        lessons.forEach((item, index) => {
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

    const handleScrollLessson = (element: HTMLElement) => {
        const scrollPosition = element.getBoundingClientRect().top;
        //@ts-ignore
        const rightTop = rightMenuRef.current.getBoundingClientRect().top;
        if (menuScrollRef.current instanceof HTMLDivElement) {
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
    })

    return (
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
                        arrayChapter.length > 0 && arrayChapter.map((c, index) => (
                            <div className='chapter' key={index}
                                style={{ display: (isEditLesson && c.id !== chapterId) ? 'none' : '' }}
                            >
                                <div
                                    className='chapter-title'
                                    onClick={(e) => {
                                        setOpenSections((prev) => {
                                            const copyState = prev;
                                            return {
                                                ...copyState,
                                                [index]: !copyState[index],
                                            }
                                        })
                                        handleScrollMenu(e, "chapter", openSections[index]);
                                    }}
                                >
                                    {`Chapter ${index > 0 ? index + 1 : '0' + (index + 1).toString()}: ${c.title}`}
                                    {openSections[index] ? <span className='up-arrow'><UpArrow /></span> : <span className="down-arrrow"><DownArrow /></span>}
                                    <div className='chapter-action'>
                                        <PlusSquareOutlined className='add' />
                                        <EditOutlined className='edit' style={{ marginRight: arrayChapter.length === 1 ? '5px' : '0px' }} />
                                        {arrayChapter.length > 1 && <DeleteOutlined className='delete' />}
                                    </div>
                                </div>

                                <div
                                    className='chapter-lesson'
                                    style={{
                                        display: openSections[index] ? "block" : "none",
                                    }}
                                >
                                    <ul>
                                        {c.lessons.map((l, lIndex) =>
                                            <li
                                                style={{ display: (isEditLesson && l.contentId !== contentId) ? 'none' : '' }}
                                                className={'lesson-title'}
                                                key={l.id}

                                                onClick={(e) => {
                                                    handleLessonClick(l.id);
                                                    handleScrollMenu(e, 'lesson')
                                                }}
                                            >
                                                {`${index * 10 + lIndex + 1}. ${l.title}`}
                                                <div
                                                    className='lesson-action'
                                                >
                                                    <PlusSquareOutlined className='add' />
                                                    <EditOutlined
                                                        className='edit'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/course-manage/lesson/edit/${l.contentId}`);
                                                        }}
                                                    />
                                                    <MergeCellsOutlined className='swap' />
                                                    {c.lessons.length > 1 && <DeleteOutlined className='delete' />}
                                                    <VideoCameraAddOutlined className='lesson-video' />
                                                </div>
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
    );
})

export default CourseMenu;