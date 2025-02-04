
import { Input, Modal, Form, notification } from 'antd';

import React, { Dispatch, SetStateAction } from 'react';
import { callCreateCategory } from '@/config/api';
import { ICategoryCreate } from '@/types/backend';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AddCategoryModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen }) => {

    const [form] = Form.useForm();
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newCategory: ICategoryCreate = {
                name: values.name,
                value: values.value
            };
            const res = await callCreateCategory(newCategory);
            if (res.statusCode === 201 && res.data) {
                window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/admin/category`;
                setIsModalOpen(false);
                form.resetFields();
            } else if (res.statusCode === 400) {
                notification.error({
                    message: res.message ? res.message : 'An error has occurred'
                })
            }
        } catch (info) {
            notification.error({
                message: 'An error has occurred'
            })
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <Modal
            width={500}
            title="Add New Category"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Submit"
            cancelText="Cancel"
            className='add-modal'
            maskClosable={false}
        >
            <div style={{ display: 'flex', width: '100%', marginTop: '15px' }}>
                <Form
                    form={form} layout="vertical" name="modalForm"
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        label="Name"
                        labelCol={{ span: 24 }}
                        name="name"
                        rules={[{ required: true, message: "Please enter name!" }]}
                    >
                        <Input placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item
                        label="Value"
                        name="value"
                    >
                        <Input placeholder="Enter value" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default AddCategoryModal;
