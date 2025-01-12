
import { Input, Modal, Form, notification } from 'antd';

import React, { Dispatch, SetStateAction } from 'react';
import { callCreateRole } from '@/config/api';
import { IRoleCreate } from '@/types/backend';
import { createRoutesFromChildren } from 'react-router-dom';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AddRoleModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen }) => {

    const [form] = Form.useForm();
    const { TextArea } = Input;
    const handleOk = async () => {
        try {
            // Validate form fields
            const values = await form.validateFields();

            const newRole: IRoleCreate = {
                name: values.name,
                description: values.description
            };
            const res = await callCreateRole(newRole);
            console.log('check res create: ', res)
            if (res.statusCode === 201 && res.data) {
                window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/admin/role`;
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
        <>
            <Modal
                width={500}
                title="Add New Role"
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

export default AddRoleModal;
