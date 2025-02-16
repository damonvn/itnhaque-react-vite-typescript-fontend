
import { Input, Modal, Form, Button, message, Upload, Select } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { callCreateCourse, callFetchAllCategories, callFetchAllSkills, callFetchUpdateCourse, callUpdateCourse, callUploadCourseImage } from '@/config/api';
import { INewCourse, IUpdateCourse } from '@/types/backend';

interface IProps {
    courseId: number;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
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

interface ISkillSelect {
    value: number,
    label: string
}

interface ICategorySelect {
    value: number,
    label: string
}


const UpdateCourseModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen, courseId }) => {

    const [imageName, setImageName] = useState('')
    const [skillList, setSkillList] = useState<ISkillSelect[]>([]);
    const [categoryList, setCategoryList] = useState<ICategorySelect[]>([]);
    const [form] = Form.useForm();
    const { TextArea } = Input;

    const handleUploadImage = async ({ file, onSuccess, onError }: any) => {
        const resImg = await callUploadCourseImage(file, "course");
        if (resImg && resImg.data) {
            setImageName(resImg.data.fileName);
            // setDataLogo([{
            //     name: res.data.fileName,
            //     uid: uuidv4()
            // }])

            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                // setDataLogo([])
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
            const course: IUpdateCourse = {
                id: courseId,
                title: values.title,
                category: {
                    id: values.category
                },
                skill: {
                    id: values.category
                },
                description: values.description,
                image: imageName
            };

            // Call API to create course
            const resCourse = await callUpdateCourse(course);
            if (resCourse && resCourse.data && resCourse.statusCode === 200) {
                setIsModalOpen(false);
                window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/admin/course`;
            }

            // Close the modal and reset form fields

        } catch (info) {
            console.log("Validation Failed:", info);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields(); // Optional: reset form when cancelling
    };

    useEffect(() => {
        const fetchUpdateCourse = async () => {
            const res = await callFetchUpdateCourse(courseId);
            if (res && res.data) {
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

                form.setFieldsValue({
                    title: res.data.title,
                    category: res.data.category.id,
                    skill: res.data.skill.id,
                    description: res.data.description,
                });
                setImageName(res.data.image)
            }
        }
        fetchUpdateCourse();
    }, [courseId])

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
                                backgroundImage: `url('${import.meta.env.VITE_BACKEND_URL}/storage/course/${imageName}')`,
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
                            <Button icon={<PlusOutlined />}>Update Image</Button>
                        </Upload>
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        name="modalForm"
                        style={{
                            width: '60%', paddingLeft: '25px'
                        }}
                    //borderLeft: '1px solid #dedede'
                    >
                        <Form.Item
                            label="Course Title"
                            name="title"
                            rules={[{ required: true, message: "Please enter name!" }]}
                        >
                            <Input placeholder="Enter name" />
                        </Form.Item>
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: "Please enter name!" }]}
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
                            rules={[{ required: true, message: "Please enter name!" }]}
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

export default UpdateCourseModal;
