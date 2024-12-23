
import { Input, Modal, Form, Button } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}


const AddCourseModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen }) => {

    const [form] = Form.useForm();
    const { TextArea } = Input;

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log("Form Values:", values);
                setIsModalOpen(false);
                form.resetFields(); // Reset form after submission
            })
            .catch((info) => {
                console.log("Validation Failed:", info);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields(); // Optional: reset form when cancelling
    };
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
            >
                <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ width: '40%', height: '200px', paddingRight: '24px' }}>
                        <div
                            style={{ borderRight: '1px solid grey', height: '100%' }}
                        >Image</div>
                    </div>
                    <Form
                        form={form} layout="vertical" name="modalForm"
                        style={{
                            width: '60%'
                        }}
                    >
                        <Form.Item
                            label="Course Title"
                            name="title"
                            rules={[{ required: true, message: "Please enter your name!" }]}
                        >
                            <Input placeholder="Enter your name" />
                        </Form.Item>
                        <Form.Item
                            label="Introduce"
                            name="introduce"
                            rules={[
                                { required: true, message: "Please enter your email!" },
                                { type: "email", message: "Please enter a valid email!" },
                            ]}
                        >
                            <TextArea
                                placeholder="Enter your description"
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
