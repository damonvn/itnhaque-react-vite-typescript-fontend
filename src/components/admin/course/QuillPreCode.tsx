import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill'; // Import React-Quill
import 'react-quill/dist/quill.snow.css'; // Import CSS của Quill


const MyEditor = () => {
    const [content, setContent] = useState('');
    const quillRef = useRef(null);

    // Cấu hình toolbar và các module khác
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline'],
            ['code-block'],  // Thêm nút code-block
        ],
    }), []); // [] làm mảng phụ thuộc để modules chỉ được tính toán lại khi có sự thay đổi

    // Hàm xử lý khi nội dung editor thay đổi
    const handleChange = (value: any) => {
        setContent(value);
    };

    const copyCode = () => {
        const father = document.querySelector('.ql-syntax');
        if (father) {
            // Loại bỏ tất cả ký tự &nbsp;

            // Lấy nội dung cần sao chép, trừ button
            const innerHTML = father.innerHTML.replace(/&nbsp;/g, ' ');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = innerHTML;
            const contentToCopy = tempDiv.textContent;
            // Sao chép vào clipboard
            //@ts-ignore
            navigator.clipboard.writeText(contentToCopy)
                .then(() => {
                    alert('Copied successfully!');
                })
                .catch(err => {
                    console.error('Copy failed: ', err);
                });
        };
    }
    return (
        <div style={{ maxWidth: '1000px', margin: 'auto' }}>
            <ReactQuill
                ref={quillRef}
                value={content}
                onChange={handleChange}
                theme="snow"
                modules={modules} // Cấu hình modules
            />
            <button
                onClick={() => copyCode()}
            >
                Copy
            </button>
        </div>
    );
}


export default MyEditor;