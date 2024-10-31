import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Styles for Quill Editor
import 'highlight.js/styles/monokai.css';
import hljs from 'highlight.js';
import { useEffect, useRef, useState } from 'react';
import '@/styles/quill.editor.scss'


const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'link', 'code-block'
];

const QuillEditor = () => {
    const quillRef = useRef(null);
    const handleImageUpload = () => {
        const url = prompt('Enter the Image URL:');
        if (url) {
            //@ts-ignore
            const quill = quillRef.current?.getEditor();

            if (quill) {
                console.log('check quill: ', quill);
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

    const modules = {
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
    }

    return (
        <>
            < Editor quillRef={quillRef} modules={modules} />
        </>
    );
}


interface Props {
    quillRef: any; // Một prop kiểu string
    modules: any;
}

const Editor: React.FC<Props> = ({ quillRef, modules }) => {
    //@ts-ignore
    const [lesson, setLesson] = useState('');
    const [editorValue, setEditorValue] = useState(''); // Giá trị ban đầu

    const handleOnchange = (value: any) => {
        setEditorValue(value);
    }

    const getLesson = () => {
        if (quillRef.current) {
            //@ts-ignore
            const quillEditor = quillRef.current.getEditor();
            const html = quillEditor.root.innerHTML;
            setLesson(html);  // Cập nhật giá trị lesson
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;  // Lấy vị trí scroll hiện tại
            const quillTop = document.querySelector('.quill-editor-custom');
            const quillTobar = document.querySelector('.ql-toolbar');
            const editorContainer = document.querySelector('.ql-container');
            if (quillTobar && editorContainer && quillTop) {
                //@ts-ignore
                quillTobar.style.transition = 'opacity 0.3s ease';
                if (editorContainer.getBoundingClientRect().bottom < 120) {
                    //@ts-ignore
                    if (quillTobar.style.opacity !== '0') {
                        //@ts-ignore
                        if (quillTobar.style.opacity !== '0') {
                            //@ts-ignore
                            quillTobar.style.opacity = '0';  // Ẩn dần dần
                        }

                    }

                } else {
                    //@ts-ignore
                    if (quillTobar.style.opacity === '0') {
                        //@ts-ignore
                        quillTobar.style.opacity = '1';
                    }
                    if (quillTop.getBoundingClientRect().top < 0) {
                        //@ts-ignore
                        if (quillTobar.style.position !== 'fixed') {
                            //@ts-ignore
                            quillTobar.style.width = `${editorContainer.clientWidth + 2}px`;
                            //@ts-ignore
                            quillTobar.style.position = 'fixed';
                            //@ts-ignore
                            quillTobar.style.top = '0px';

                        }
                    } else {
                        //@ts-ignore
                        if (quillTobar.style.position === 'fixed') {
                            //@ts-ignore
                            quillTobar.style.position = 'absolute';
                        }
                    }

                }


            }

            console.log('Y-axis scroll:', scrollY);
            // Thực hiện các hành động khác khi scroll
        };

        // Gán sự kiện scroll cho window
        window.addEventListener('scroll', handleScroll);

        // Cleanup sự kiện khi component bị unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    return (
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
            <button
                style={{
                    marginTop: '15px',
                    marginBottom: '15px'
                }}
                onClick={() => getLesson()}
            >Preview</button>
            <div
                style={{
                    textAlign: 'left'
                }}
                dangerouslySetInnerHTML={{ __html: lesson }}
            />
        </div>
    );
}

export default QuillEditor;