import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Styles for Quill Editor
import 'highlight.js/styles/monokai.css';
import hljs from 'highlight.js';
import React, { useEffect, useRef, useState, memo, useMemo } from 'react';
import '@/styles/quill.editor.scss';
import { IContent } from '@/types/backend';
import { callUpdateLesson } from '@/config/api';
import { Button, Input } from 'antd';



const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'link', 'code-block'
];

interface IProps {
    lessonContent: IContent
}

const QuillEditor: React.FC<IProps> = memo(({ lessonContent }) => {

    const [lessonTitle, setLessonTitle] = useState('');
    const [lsVideoURL, setLsVideoURL] = useState('');
    const [editorValue, setEditorValue] = useState(''); // Giá trị ban đầu

    const handleOnchange = (value: any) => {
        setEditorValue(value);
    }

    const quillRef = useRef(null);
    const handleImageUpload = () => {
        const url = prompt('Enter the Image URL:');
        if (url) {
            //@ts-ignore
            const quill = quillRef.current?.getEditor();

            if (quill) {
                const range = quill.getSelection();  // Lấy vị trí con trỏ
                if (range) {
                    const editorContainer = quill.root;

                    // Tạo thẻ <img> và chèn vào vị trí con trỏ
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = 'Image';
                    img.style.maxWidth = '70%'; // Để đảm bảo hình ảnh không bị vỡ bố cục

                    // Chèn hình ảnh vào container tại vị trí con trỏ
                    const index = range.index;
                    const textNode = editorContainer.childNodes[index];
                    editorContainer.insertBefore(img, textNode ? textNode : null);
                }
            }
        }
    };

    const handleVideoEmbed = () => {
        const url = prompt('Enter the video URL:');
        if (url) {
            const isYouTube = url.match(/(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/);
            if (isYouTube) {
                const videoId = isYouTube[6];
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                //@ts-ignore
                const quill = quillRef.current?.getEditor();
                if (quill) {
                    const editorContainer = quill.root;
                    const range = quill.getSelection();
                    if (range) {
                        // Chèn video vào đúng vị trí con trỏ
                        const videoEmbed = document.createElement('iframe');
                        videoEmbed.setAttribute('src', embedUrl);
                        videoEmbed.setAttribute('frameborder', '0');
                        videoEmbed.setAttribute('allowfullscreen', 'true');
                        videoEmbed.style.width = '70%';
                        videoEmbed.style.height = '315px'; // Tùy chỉnh chiều cao video
                        // Lấy phần tử text node tại vị trí con trỏ
                        const textNode = editorContainer.childNodes[range.index];
                        if (textNode) {
                            // Chèn video vào DOM trực tiếp tại vị trí con trỏ
                            editorContainer.insertBefore(videoEmbed, textNode);
                        } else {
                            // Nếu không tìm thấy text node, chèn vào cuối cùng
                            editorContainer.appendChild(videoEmbed);
                        }
                    }
                }
            } else {
                alert('Invalid video URL');
            }
        }
    };

    const handleLinkInsert = () => {
        const url = prompt('Enter the link URL:');
        if (url) {
            //@ts-ignore
            const quill = quillRef.current?.getEditor();
            if (quill) {
                const range = quill.getSelection(); // Lấy vị trí hiện tại của con trỏ
                if (range) {
                    quill.insertText(range.index, url, 'link', url); // Chèn link tại vị trí con trỏ
                }
            }
        }
    };

    const modules = useMemo(() => ({
        syntax: {
            //@ts-ignore
            highlight: (text) => {
                const hlight = hljs.highlightAuto(text).value;
                return hlight;
            },
        },
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'video', 'image'],
            ],
            handlers: {
                image: handleImageUpload, // Gọi hàm upload khi bấm nút hình ảnh
                video: handleVideoEmbed,
                link: handleLinkInsert
            }
        }
    }), []);

    const handleUpdateLessonContent = async () => {
        if (quillRef.current) {
            const lesson: IContent = lessonContent;
            lesson.title = lessonTitle;
            lesson.content = editorValue;
            lesson.lessonVideoURL = lsVideoURL;
            const res = await callUpdateLesson(lesson);
            if (res && res?.data) {
                window.location.href = `/admin-course-manage/lesson/${res.data.id}`;
            }
        }
    }
    useEffect(() => {
        setLessonTitle(lessonContent.title);
        setLsVideoURL(lessonContent.lessonVideoURL);
        setEditorValue(lessonContent.content);
    }, [])



    return (
        <>
            <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', marginBottom: '6px', marginTop: '14px    ' }}><span style={{ color: 'red' }}>*</span>Lesson Title</label>
            <Input
                value={lessonTitle}
                onChange={(e) => {
                    setLessonTitle(e.target.value);
                }}
            />
            <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', marginBottom: '6px', marginTop: '14px    ' }}><span style={{ color: 'red' }}>*</span>Lesson Video URL</label>
            <Input
                value={lsVideoURL}
                onChange={(e) => {
                    setLsVideoURL(e.target.value);
                }}
            />
            <div
                className='quill-editor-custom'
            >
                <ReactQuill
                    style={{
                        minWidth: '600px',
                        marginTop: '30px',
                        textAlign: 'center',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                    value={editorValue}
                    modules={modules}
                    formats={formats}
                    ref={quillRef}
                    onChange={handleOnchange}
                />
                <Button
                    style={{
                        marginTop: '15px',
                        marginBottom: '15px'
                    }}
                    onClick={() => {
                        handleUpdateLessonContent();
                    }}
                >Save</Button>
            </div>
        </>
    );
})

export default QuillEditor;
