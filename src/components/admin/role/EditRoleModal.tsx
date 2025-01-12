


import { Input, Modal, Form, notification } from 'antd';

import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { callCreateRole, callFetchRoleById, callUpdateRole } from '@/config/api';
import { IRoleCreate, IRoleUpdate } from '@/types/backend';

interface IEdit {
    isOpened: boolean,
    roleId: number
}

interface IProps {
    isModalOpen: IEdit;
    setIsModalOpen: Dispatch<SetStateAction<IEdit>>;
}

const EditRoleModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen }) => {

    const [form] = Form.useForm();
    const { TextArea } = Input;
    const handleOk = async () => {
        try {
            // Validate form fields


            const values = await form.validateFields();
            console.log('check vl: ', values)
            const newRole: IRoleUpdate = {
                id: values.id,
                name: values.name,
                description: values.description
            };
            const res = await callUpdateRole(newRole);
            if (res.statusCode === 200) {
                window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/admin/role`;
                setIsModalOpen({ isOpened: false, roleId: -1 });
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
        setIsModalOpen({ isOpened: false, roleId: -1 });
        form.resetFields();
    };

    const fetchRoleById = async (id: number) => {
        const res = await callFetchRoleById(id);
        if (res?.data) {
            form.setFieldsValue({
                id: res.data.id,
                name: res.data.name,
                description: res.data.description,
            });
        }
    }

    useEffect(() => {
        fetchRoleById(isModalOpen.roleId)
    }, [])

    return (
        <Modal
            width={500}
            title="Update Role"
            open={isModalOpen.isOpened}
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
                        label="Id"
                        name="id"
                        hidden={true}
                    >
                        <Input />
                    </Form.Item>
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
    );
}

export default EditRoleModal;
