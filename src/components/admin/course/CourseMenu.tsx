import React, { useState, useRef, useEffect, memo } from 'react';
import { DeleteOutlined, EditOutlined, MergeCellsOutlined, PlusSquareOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import '@/styles/course.manage.scss'
import UpArrow from '@/assets/Icons/UpArrow';
import DownArrow from '@/assets/Icons/DownArrow';
import { callFetchCourse } from '@/config/api';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IChapter } from '@/types/backend';
import AddChapter from './AddChapterModal';
import AddLesson from './AddLessonModal';
import AddLessonVideo from './AddLessonVideoModal';


interface Props {
    courseId: number;
    contentId: number
    chapterId: number
}

export interface AddChapterState {
    openModal: boolean;
    chapterIndex: number
}

const initialAddChapterState: AddChapterState = {
    openModal: false,
    chapterIndex: -1,
}

export interface AddLessonState {
    openModal: boolean;
    chapterId: number;
    lessonIndex: number
}

const initialAddLessonState: AddLessonState = {
    openModal: false,
    chapterId: 0,
    lessonIndex: -1,
}

export interface AddLessonVideoState {
    openModal: boolean;
    lessonId: number;
}

const initialAddLessonVideoState: AddLessonVideoState = {
    openModal: false,
    lessonId: 0,
}


const CourseMenu: React.FC<Props> = memo(({ courseId, contentId, chapterId }) => {
    const rightMenuRef = useRef<HTMLDivElement>(null);
    const menuScrollRef = useRef<HTMLDivElement>(null);
    const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
    const [arrayChapter, setArrayChapter] = useState<IChapter[]>([]);
    const [courseLoaded, setCourseLoaded] = useState(false);
    const [openAddChapter, setOpenAddChapter] = useState<AddChapterState>(initialAddChapterState);
    const [openAddLesson, setOpenAddLesson] = useState<AddLessonState>(initialAddLessonState);
    const [openAddLessonVideo, setOpenAddLessonVideo] = useState<AddLessonVideoState>(initialAddLessonVideoState);
    const location = useLocation();
    const isOpenLesson = location.pathname.includes('/course-manage/lesson');
    const isEditLesson = location.pathname.includes('/lesson/edit');
    const isOpenNewChapter = location.pathname.includes('/chapter/lesson');
    const navigate = useNavigate();
    const handleLessonClick = (lessonId: number) => {
        navigate(`/course-manage/lesson/${lessonId}`);
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
                                        className={`chapter-title ${isOpenNewChapter && chapterId === c.id ? 'chapter-opening' : ''}`}
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
                                        <div className='chapter-action'>
                                            <PlusSquareOutlined
                                                className='add'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newState: AddChapterState = {
                                                        openModal: true,
                                                        chapterIndex: cIndex + 1,
                                                    }
                                                    setOpenAddChapter(newState);
                                                }}
                                            />
                                            <EditOutlined
                                                className='edit' style={{ marginRight: arrayChapter.length === 1 ? '5px' : '0px' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            />
                                            {arrayChapter.length > 1 && <DeleteOutlined className='delete' />}
                                        </div>
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
                                                    className={`lesson-title ${(isOpenLesson && l.contentId === contentId) ? 'lesson-opening' : ''}`}
                                                    key={l.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLessonClick(l.id);
                                                        handleScrollMenu(e, 'lesson')
                                                    }}
                                                >
                                                    {`${cIndex * 10 + lIndex + 1}. ${l.title}`}
                                                    <div
                                                        className='lesson-action'
                                                    >
                                                        <PlusSquareOutlined
                                                            className='add'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newState: AddLessonState = {
                                                                    openModal: true,
                                                                    chapterId: c.id,
                                                                    lessonIndex: lIndex + 1,
                                                                }
                                                                setOpenAddLesson(newState);
                                                            }}

                                                        />
                                                        <EditOutlined
                                                            className='edit'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/course-manage/lesson/edit/${l.contentId}`);
                                                            }}
                                                        />
                                                        <MergeCellsOutlined className='swap' />
                                                        {c.lessons.length > 1 && <DeleteOutlined className='delete' />}
                                                        {!l.linkVideo ?
                                                            <VideoCameraAddOutlined
                                                                className='lesson-video'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const newState: AddLessonVideoState = {
                                                                        lessonId: l.id,
                                                                        openModal: true
                                                                    }
                                                                    setOpenAddLessonVideo(newState);
                                                                }}
                                                            />
                                                            :
                                                            <VideoCameraOutlined
                                                                className='lesson-video'
                                                                onClick={() => {
                                                                    window.open(`${l.linkVideo}`, '_blank');
                                                                }}
                                                            />
                                                        }

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
            {openAddChapter.openModal && <AddChapter state={openAddChapter} setSate={setOpenAddChapter} courseId={courseId} />}
            {openAddLesson.openModal && <AddLesson state={openAddLesson} setState={setOpenAddLesson} courseId={courseId} />}
            {openAddLessonVideo.openModal && <AddLessonVideo state={openAddLessonVideo} setState={setOpenAddLessonVideo} />}
        </>
    );
})

export default CourseMenu;