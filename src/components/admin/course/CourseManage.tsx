import { useState, useRef, useEffect } from 'react';

import 'react-quill/dist/quill.snow.css';
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
    lessonVideoURL: '',
    content: ''
}

const CourseManage = () => {
    const rightMenuRef = useRef(null);
    const menuScrollRef = useRef(null);
    const [courseId, setCourseId] = useState<number>(0)
    const [lessonContent, setLessonContent] = useState<IContent>(initialContent);
    const [isRender, setIsRender] = useState<boolean>(false);

    const location = useLocation();
    const isEditLesson = location.pathname.includes('/lesson/edit');

    const { id } = useParams();

    const getLesson = async (contentId: number) => {
        const res = await callFetchContent(contentId);
        if (res && res.data) {
            setCourseId(res.data.courseId);
            setLessonContent(res.data);
            setIsRender(true);
        }
    }

    useEffect(() => {
        //@ts-ignore
        getLesson(+id);
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
                                {
                                    lessonContent.id !== 0 &&
                                    <QuillEditor
                                        lessonContent={lessonContent}
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