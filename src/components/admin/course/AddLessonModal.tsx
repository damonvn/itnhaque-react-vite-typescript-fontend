import React, { useState } from 'react';
import { Input, Modal } from 'antd';
import { callCreateLesson } from '@/config/api';
import { INewLesson } from '@/types/backend';
import { AddLessonState } from './CourseMenu';

interface AddChapterProps {
    state: AddLessonState;
    setState: React.Dispatch<React.SetStateAction<AddLessonState>>;
    courseId: number;
}

const AddLesson: React.FC<AddChapterProps> = ({ state, setState, courseId }) => {
    const [chapterTitle, setChapterTitle] = useState('');

    const handleOk = async () => {
        const newLesson: INewLesson = {
            title: chapterTitle,
            courseId: courseId,
            chapter: {
                id: state.chapterId
            },
            indexInChapter: state.lessonIndex
        };
        const res = await callCreateLesson(newLesson);
        if (res?.data) {
            window.location.href = `admin/course-manage/lesson/edit/${res.data.id}`;
            const newState: AddLessonState = {
                openModal: false,
                chapterId: 0,
                lessonIndex: -1,
            }
            setState(newState);
        }
    };

    const handleCancel = () => {
        const newState: AddLessonState = {
            openModal: false,
            chapterId: 0,
            lessonIndex: -1,
        }
        setState(newState);
    };

    return (
        <>
            <Modal
                title="Lesson Title"
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

export default AddLesson;