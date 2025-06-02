import React, { useEffect, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { callFetchChapterById, callUpdateChapter } from '@/config/api';
import { IEditChapter } from './CourseMenu';
import { IUpdateChapter } from '@/types/backend';




interface EditChapterProps {
    state: IEditChapter;
    setState: React.Dispatch<React.SetStateAction<IEditChapter>>;
}

const EidtChapterModal: React.FC<EditChapterProps> = ({ state, setState }) => {
    const [chapterTitle, setChapterTitle] = useState('');
    const [form] = Form.useForm();

    const handleOk = async () => {
        const updateChapter: IUpdateChapter = {
            id: state.chapterId,
            title: chapterTitle,
        };
        const res = await callUpdateChapter(updateChapter);
        if (res.statusCode === 200 && res?.data) {
            window.location.href = `/admin-course-manage/chapter/lesson/${res.data.id}`;
            const newState: IEditChapter = {
                openModal: false,
                chapterId: -1,
            }
            setState(newState);
        }
    };

    const handleCancel = () => {
        const newState: IEditChapter = {
            openModal: false,
            chapterId: -1,
        }
        setState(newState);
    };

    const fetchChapter = async (id: number) => {
        const res = await callFetchChapterById(id);
        if (res?.data) {
            form.setFieldsValue({
                id: res.data.id,
                title: res.data.title
            })
        }
    }

    useEffect(() => {
        fetchChapter(state.chapterId);
    }, [])

    return (
        <>
            <Modal
                title="Edit Chapter"
                open={state.openModal}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={false}
            >

                <Form
                    form={form} layout="vertical" name="modalForm"
                    style={{ width: '100%', marginTop: '25px' }}
                >
                    <Form.Item
                        label="Id"
                        name="id"
                        hidden={true}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Title"
                        name="title"
                        labelCol={{ span: 24 }}
                        required
                    >
                        <Input
                            value={chapterTitle}
                            onChange={(e) => setChapterTitle(e.target.value)}
                        />
                    </Form.Item>
                </Form>

            </Modal>
        </>
    );
};

export default EidtChapterModal;