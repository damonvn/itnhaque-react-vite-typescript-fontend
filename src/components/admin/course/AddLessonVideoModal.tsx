import React, { useState } from 'react';
import { Input, Modal } from 'antd';
import { AddLessonVideoState } from './CourseMenu';
import { IAddLessonVideo } from '@/types/backend';
import { callAddLessonVideo } from '@/config/api';

interface Props {
    state: AddLessonVideoState;
    setState: React.Dispatch<React.SetStateAction<AddLessonVideoState>>;
}

const AddLessonVideo: React.FC<Props> = ({ state, setState }) => {
    const [videoURL, setVideoURL] = useState('');
    const handleOk = async () => {
        const data: IAddLessonVideo = {
            lessonId: state.lessonId,
            lessonVideoURL: videoURL
        };
        const res = await callAddLessonVideo(data);
        if (res?.data) {
            window.location.href = `admin/course-manage/lesson/${res.data.id}`;
            const newState: AddLessonVideoState = {
                openModal: false,
                lessonId: -1
            }
            setState(newState);
        }
    };

    const handleCancel = () => {
        const newState: AddLessonVideoState = {
            openModal: false,
            lessonId: -1,
        }
        setState(newState);
    };

    return (
        <>
            <Modal
                title="Lesson Video URL"
                open={state.openModal}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={false}
            >
                <Input
                    value={videoURL}
                    onChange={(e) => setVideoURL(e.target.value)}
                />
            </Modal>
        </>
    );
};

export default AddLessonVideo;