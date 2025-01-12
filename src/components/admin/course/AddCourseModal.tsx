
import { Input, Modal, Form, Button, message, Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { callCreateCourse, callFetchAllCategories, callFetchAllSkills, callUploadCourseImage } from '@/config/api';
import { INewCourse } from '@/types/backend';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface ISkillSelect {
    value: number,
    label: string
}

interface ICategorySelect {
    value: number,
    label: string
}

const handleUploadChange = (info: any) => {
    if (info.file.status === 'uploading') {
        // setLoadingUpload(true);
    }
    if (info.file.status === 'done') {
        // setLoadingUpload(false);
    }
    if (info.file.status === 'error') {
        // setLoadingUpload(false);
        message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
    }
};


const AddCourseModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [imageLink, setImageLink] = useState('')
    const [skillList, setSkillList] = useState<ISkillSelect[]>([]);
    const [categoryList, setCategoryList] = useState<ICategorySelect[]>([]);

    const [form] = Form.useForm();
    const { TextArea } = Input;

    const handleUploadImage = async ({ file, onSuccess, onError }: any) => {
        const resImg = await callUploadCourseImage(file, "course");
        if (resImg && resImg.data) {
            setImageLink(resImg.data.fileName);
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                const error = new Error(resImg.message);
                onError({ event: error });
            }
        }
    };

    const handleOk = async () => {
        try {
            // Validate form fields
            const values = await form.validateFields();
            // Create course object
            const course: INewCourse = {
                title: values.title,
                description: values.description,
                image: imageLink,
                category: {
                    id: values.category
                },
                skill: {
                    id: values.skill
                }
            };

            // Call API to create course
            const resCourse = await callCreateCourse(course);
            if (resCourse && resCourse.data) {
                window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/admin/course`;
                // Close the modal and reset form fields
                setIsModalOpen(false);
                form.resetFields();
            }
        } catch (info) {
            console.log("Validation Failed:", info);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields(); // Optional: reset form when cancelling
    };


    useEffect(() => {
        const fetchCategories = async () => {
            const resCategories = await callFetchAllCategories();
            if (resCategories?.data) {
                const categorySelect: ICategorySelect[] = [];
                resCategories.data.map((ct) => {
                    categorySelect.push({ value: ct.id, label: ct.name });
                })
                setCategoryList(categorySelect);
            }
        }
        const fetchSkills = async () => {
            const resSkills = await callFetchAllSkills();
            if (resSkills?.data) {
                const skillSelect: ISkillSelect[] = [];
                resSkills.data.map((sk) => {
                    skillSelect.push({ value: sk.id, label: sk.name });
                })
                setSkillList(skillSelect);
            }
        }

        fetchCategories();
        fetchSkills();
    }, [])

    return (
        <>
            <Modal
                width={800}
                title="Add New Course"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Submit"
                cancelText="Cancel"
                maskClosable={false}
            >
                <div style={{ display: 'flex', width: '100%', marginTop: '15px' }}>
                    <div style={{ width: '40%', height: '100%', paddingRight: '10px' }}>
                        <div
                            style={{ height: '100%', paddingRight: '25px' }}
                        >
                            <div style={{
                                border: '1px solid #dedede',
                                height: '170px',
                                marginTop: '8px',
                                marginBottom: '20px',
                                backgroundImage: `url('${import.meta.env.VITE_BACKEND_URL}/storage/course/${imageLink}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}>
                            </div>
                        </div>
                        <Upload
                            name="logo"
                            maxCount={1}
                            multiple={false}
                            customRequest={handleUploadImage}
                            // beforeUpload={beforeUpload}
                            onChange={handleUploadChange}
                        // onRemove={(file) => handleRemoveFile(file)}
                        // onPreview={handlePreview}
                        >
                            <Button icon={<PlusOutlined />}>Upload Avatar</Button>
                        </Upload>
                    </div>
                    <Form
                        form={form} layout="vertical" name="modalForm"
                        style={{
                            width: '60%', paddingLeft: '25px'
                        }}
                    //borderLeft: '1px solid #dedede'
                    >
                        <Form.Item
                            label="Course Title"
                            name="title"
                            rules={[{ required: true, message: "Please enter title!" }]}
                        >
                            <Input placeholder="Enter title" />
                        </Form.Item>
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: "Please select category!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select category"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={categoryList}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Skill"
                            name="skill"
                            rules={[{ required: true, message: "Please select skill!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select skill"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={skillList}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <TextArea
                                placeholder="Enter description"
                                rows={4} // Số dòng hiển thị
                            />
                        </Form.Item>

                    </Form>
                </div>
            </Modal>

        </>
    );
}

export default AddCourseModal;
