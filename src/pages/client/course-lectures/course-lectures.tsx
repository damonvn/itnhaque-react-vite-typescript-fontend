import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/monokai.css';
// import '@/styles/course.manage.scss'
import './course-lectures.scss';

import { callFetchClientContent, callGetLessonParameters, callNextBtnHandle, callPrevBtnHandle } from '@/config/api';
import { IContent } from '@/types/backend';
import { useParams } from 'react-router-dom';
import CopyIcon from '@/assets/CopyIcon';
import ClientCourseMenu from '@/components/client/course/ClientCourseMenu';
import { ArrowLeftOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';


const initialContent: IContent = {
    id: 0,
    courseId: 0,
    chapterId: 0,
    lessonId: 0,
    title: '',
    lessonVideoURL: '',
    content: ''
}

const CourseLectures = () => {
    const rightMenuRef = useRef(null);
    const menuScrollRef = useRef(null);
    const [courseId, setCourseId] = useState<number>(0)
    const [courseTitle, setCourseTitle] = useState<string>('')
    const [lessonContent, setLessonContent] = useState<IContent>(initialContent);
    const [isRender, setIsRender] = useState<boolean>(false);
    const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1);
    const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(-1);
    const [chaptersSize, setChaptersSize] = useState<number>(-1);
    const [lessonsSize, setLessonsSize] = useState<number>(-1);
    const [menuShow, setMenuShow] = useState<boolean | null>(null);
    // Lấy giá trị của tham số `menushow`
    const [searchParams, setSearchParams] = useSearchParams();
    const menuShowParam = searchParams.get('menushow');

    const { id } = useParams();
    const nextBtnOnClickHandle = async () => {
        //@ts-ignore
        const res = await callNextBtnHandle(id);
        if (res?.data) {
            if (menuShow === false) {
                window.location.href = `/course/lesson/${res.data}?menushow=false`;
            } else {
                window.location.href = `/course/lesson/${res.data}`;
            }
        }
    }

    const prevBtnOnClickHandle = async () => {
        //@ts-ignore
        const res = await callPrevBtnHandle(id);
        if (res?.data) {
            // navigate(`/course/lesson/${res.data}`)
            if (menuShow === false) {
                window.location.href = `/course/lesson/${res.data}?menushow=false`;
            } else {
                window.location.href = `/course/lesson/${res.data}`;
            }
        }
    }

    const getLesson = async (contentId: number) => {
        const res = await callFetchClientContent(contentId);
        if (res && res.data) {
            setCourseId(res.data.courseId);
            setCourseTitle(res.data.courseTitle);
            setLessonContent(res.data);
            setIsRender(true);
        }
    }

    useLayoutEffect(() => {
        if (menuShow !== null) {
            const leftContent = document.querySelector('.client-lesson-content');
            if (leftContent) {
                const l = leftContent.getBoundingClientRect().left;
                const w = leftContent.getBoundingClientRect().width;

                const copyBtns = document.querySelectorAll('.copy-btn');
                if (copyBtns.length > 0) {
                    copyBtns.forEach((btn) => {
                        if (btn.getBoundingClientRect().top === 6) {
                            //@ts-ignore
                            btn.style.left = `${l + w - btn.clientWidth - 8}px`;
                        }
                    });
                }
            }
        }
    }, [menuShow]);

    useEffect(() => {
        if (menuShowParam === null) {
            setMenuShow(true);
        } else if (menuShowParam === 'true') {
            setMenuShow(true);
        } else if (menuShowParam === 'false') {
            setMenuShow(false);
        } else {
            setMenuShow(true);
        }
    }, [])

    useEffect(() => {
        //@ts-ignore
        getLesson(+id);

        const getLessonParameters = async (contentId: number) => {
            const res = await callGetLessonParameters(contentId);
            if (res?.data) {
                setCurrentChapterIndex(res.data.chapterInCourseIndex);
                setCurrentLessonIndex(res.data.lessonInChapterIndex);
                setChaptersSize(res.data.courseChapterSize);
                setLessonsSize(res.data.chapterLessonSize);
            }
        }
        //@ts-ignore
        getLessonParameters(+id);
    }, [id])

    const innerHTML = addedButtonHTML(lessonContent.content);

    useEffect(() => {
        const handleMenuScroll = () => {
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
        window.addEventListener('scroll', handleMenuScroll);
        return () => {
            window.removeEventListener('scroll', handleMenuScroll);
        };

    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleLessonScroll);
        return () => {
            window.removeEventListener('scroll', handleLessonScroll);
        };
    }, [])

    useEffect(() => {
        // Hàm xử lý
        const handleCopyCodeBlocks = () => {
            const codeBlocks = document.querySelectorAll('.ql-syntax');
            codeBlocks.forEach((fatherElement: Element) => {
                const copyBtn = fatherElement.querySelector('.copy-btn') as HTMLButtonElement | null;
                if (copyBtn) {
                    const fatherCopy = fatherElement.cloneNode(true) as HTMLElement;
                    const removeBTN = fatherCopy.querySelector('.copy-btn');
                    if (removeBTN) {
                        fatherCopy.removeChild(removeBTN);
                    }
                    const handleClick = () => {
                        const innerHTML = fatherCopy.innerHTML.replace(/&nbsp;/g, ' ');
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = innerHTML;
                        const contentToCopy = tempDiv.textContent || '';

                        // Sao chép nội dung vào clipboard
                        navigator.clipboard.writeText(contentToCopy)
                            .then(() => {
                                console.log('contentToCopy: ', contentToCopy);
                            })
                            .catch(err => {
                                console.error('Failed to copy: ', err);
                            });
                    };

                    // Lưu hàm handleClick vào thuộc tính dataset để có thể truy xuất lại
                    (copyBtn as any)._handleClick = handleClick;
                    // Gắn sự kiện click
                    copyBtn.addEventListener('click', handleClick);
                }
            });
        }

        handleCopyCodeBlocks();

        // Cleanup tổng thể
        return () => {
            const codeBlocks = document.querySelectorAll('.ql-syntax');
            codeBlocks.forEach((fatherElement: Element) => {
                const copyBtn = fatherElement.querySelector('.copy-btn') as HTMLButtonElement | null;
                if (copyBtn) {
                    const handleClick = (copyBtn as any)._handleClick; // Truy xuất lại hàm handleClick
                    if (handleClick) {
                        copyBtn.removeEventListener('click', handleClick);
                    }
                }
            });
        };
    }, [isRender]);

    useEffect(() => {
        const handleResize = () => {
            const leftContent = document.querySelector('.client-lesson-content');
            if (leftContent) {
                const l = leftContent.getBoundingClientRect().left;
                const w = leftContent.getBoundingClientRect().width;

                const copyBtns = document.querySelectorAll('.copy-btn');
                if (copyBtns.length > 0) {
                    copyBtns.forEach((btn) => {
                        if (btn.getBoundingClientRect().top === 6) {
                            console.log('btn.getBoundingClientRect().top: ', btn.getBoundingClientRect().top)
                            //@ts-ignore
                            btn.style.left = `${l + w - btn.clientWidth - 8}px`;
                        }
                    });
                }
            }
        };
        // Gắn sự kiện resize
        window.addEventListener('resize', handleResize);

        // Cleanup khi component bị unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Chỉ chạy một lần khi component được mount

    return (
        <div
            className='client-course-manager'
        >
            <header className='header' style={{ display: 'flex', alignItems: 'center' }}>

                <img
                    src="/9999999.png" alt="IT NHA QUE"
                    // src="/qblackbgrlogo.png" alt="IT NHA QUE"
                    // src="/logoqleaf123.png" alt="IT NHA QUE"
                    // src="/logoqletter.png" alt="IT NHA QUE"
                    // src="/image123-removebg-preview.png" alt="IT NHA QUE"
                    // src="/number_44622925.png" alt="IT NHA QUE"
                    style={{ width: '40px', marginTop: '0px', marginLeft: '20px', marginRight: '15px', opacity: 0.7 }}
                />
                <span style={{ paddingLeft: '25px', marginRight: '35px', borderRight: '1px solid gray', height: '20px' }}></span>
                <span>{courseTitle}</span>
            </header>
            {
                menuShow !== null &&
                <div
                    className='lesson-content'
                    style={{
                        width: menuShow ? '70%' : '100%', textAlign: 'center', minHeight: '100vh', boxSizing: 'border-box',
                    }}
                >
                    <div
                        style={{
                            width: '100%', boxSizing: 'border-box',
                            paddingLeft: menuShow === false ? '10%' : '7%', paddingRight: menuShow === false ? '10%' : '7%',
                        }}
                    >
                        <div
                            style={{ textAlign: 'left', marginTop: '10px' }}
                            className='client-lesson-content'
                            dangerouslySetInnerHTML={{ __html: innerHTML }}
                        />
                    </div>
                    {
                        menuShow === false &&
                        <div
                            className='show-course-menu-btn'
                            onClick={() => {
                                setMenuShow(true);
                                searchParams.delete('menushow');
                                setSearchParams(searchParams);

                            }}
                        >
                            <ArrowLeftOutlined style={{ fontSize: '18px' }} />
                            <span
                                className='show-course-menu-btn-text'
                            >
                                Course content
                            </span>
                        </div>
                    }

                    {
                        currentChapterIndex !== -1 && currentLessonIndex !== -1 &&
                        !(currentChapterIndex === 0 && currentLessonIndex === 0) &&
                        <div
                            className='course-left-btn'
                            onClick={() => prevBtnOnClickHandle()}
                        >
                            <LeftOutlined
                                className='course-left-btn-icon'
                                style={{
                                    position: 'absolute', left: '1px', top: '50%', transform: 'translateY(-50%)', zIndex: 50, fontSize: '27px'
                                }}

                            />
                        </div>
                    }
                    {
                        currentChapterIndex !== -1 && currentLessonIndex !== -1 && menuShow !== null &&
                        chaptersSize !== -1 && lessonsSize !== -1 &&
                        !(currentChapterIndex === chaptersSize - 1 && currentLessonIndex === lessonsSize - 1) &&
                        <div
                            className='course-right-btn'
                            style={{
                                left: menuShow ? 'calc(70vw - 42px)' : 'calc(100vw - 47px)',
                            }}
                            onClick={() => {
                                nextBtnOnClickHandle();
                            }}
                        >
                            <RightOutlined
                                className='course-right-btn-icon'
                                style={{
                                    position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 50,
                                    left: '2px',
                                    fontSize: '27px'
                                }}

                            />
                        </div>
                    }
                </div >
            }
            {
                menuShow &&
                <ClientCourseMenu
                    courseId={courseId}
                    chapterId={lessonContent.chapterId}
                    contentId={lessonContent.id}
                    menuShow={menuShow}
                    setMenuShow={setMenuShow}
                />
            }

        </div >
    );
}

export default CourseLectures;

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


const handleLessonScroll = () => {
    const codeBlocks = document.querySelectorAll('.client-lesson-content .ql-syntax');
    const lessonBlock = document.querySelector('.client-lesson-content');
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
                if (bottom > 40) {
                    //@ts-ignore
                    if (copyBTN.style.opacity !== 1) {
                        //@ts-ignore
                        copyBTN.style.opacity = 1;
                    }
                    const top = codeBlock.getBoundingClientRect().top
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
                    if (copyBTN.style.opacity !== 0) {
                        //@ts-ignore
                        copyBTN.style.opacity = 0;
                    }
                }
            }
        });
    }
};