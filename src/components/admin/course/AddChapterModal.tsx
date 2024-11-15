import React, { useState } from 'react';
import { Input, Modal } from 'antd';
import { callCreateChapter } from '@/config/api';
import { INewChapter } from '@/types/backend';
import { AddChapterState } from './CourseMenu';



interface AddChapterProps {
    state: AddChapterState;
    setSate: React.Dispatch<React.SetStateAction<AddChapterState>>;
    courseId: number;
}




const AddChapter: React.FC<AddChapterProps> = ({ state, setSate, courseId }) => {
    const [chapterTitle, setChapterTitle] = useState('');


    const handleOk = async () => {

        const newChapter: INewChapter = {
            title: chapterTitle,
            course: {
                id: courseId
            },
            indexInCourse: state.chapterIndex
        };
        const res = await callCreateChapter(newChapter);
        if (res?.data) {
            window.location.href = `/course-manage/chapter/lesson/${res.data.id}`;
            const newState: AddChapterState = {
                openModal: false,
                chapterIndex: -1,
            }
            setSate(newState);
        }
    };

    const handleCancel = () => {
        const newState: AddChapterState = {
            openModal: false,
            chapterIndex: -1,
        }
        setSate(newState);
    };

    return (
        <>
            <Modal
                title="Chapter Title"
                open={state.openModal}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                />
            </Modal>
        </>
    );
};

export default AddChapter;