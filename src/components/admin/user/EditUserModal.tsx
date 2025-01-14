import { Input, Modal, Form, Select, notification } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { callFetchAllRoles, callFetchUserById, callUpdateUser } from '@/config/api';
import { IUserUpdate } from '@/types/backend';

interface IEdit {
    isOpened: boolean,
    userId: number

}

interface IProps {
    isModalOpen: IEdit;
    setIsModalOpen: Dispatch<SetStateAction<IEdit>>;
    fetchData: (sort?: string) => Promise<void>;
}

interface IRoleSelect {
    value: number,
    label: string
}

const EditUserModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen, fetchData }) => {
    const [roleList, setRoleList] = useState<IRoleSelect[]>([]);
    const [form] = Form.useForm();
    const handleOk = async () => {
        try {
            // Validate form fields
            const values = await form.validateFields();

            const updateUser: IUserUpdate = {
                id: values.id,
                name: values.name,
                email: values.email,
                gender: values.gender,
                address: values.address,
                phone: values.phone,
                role: {
                    id: values.role
                }
            };
            const res = await callUpdateUser(updateUser);
            if (res && res.data) {
                fetchData();
                setIsModalOpen({ isOpened: false, userId: -1 });
                form.resetFields();
                notification.success({
                    message: 'Update successful!'
                })
            }
        } catch (info) {
            console.log("Validation Failed:", info);
        }
    };
    const handleCancel = () => {
        setIsModalOpen({ isOpened: false, userId: -1 });
        form.resetFields(); // Optional: reset form when cancelling
    };
    useEffect(() => {
        const fetchRoles = async () => {
            const resRoles = await callFetchAllRoles();
            if (resRoles?.data) {
                const rolleSelect: IRoleSelect[] = [];
                resRoles.data.map((r) => {
                    rolleSelect.push({ value: r.id, label: r.name });
                })
                setRoleList(rolleSelect);
            }
        }
        fetchRoles();
    }, [])
    useEffect(() => {
        const fetchUser = async (id: number) => {
            const res = await callFetchUserById(id);
            if (res.statusCode === 200 && res?.data) {
                form.setFieldsValue({
                    id: res.data.id,
                    name: res.data.name,
                    email: res.data.email,
                    gender: res.data.gender,
                    address: res.data.address,
                    phone: res.data.phone,
                    role: res.data.role.id
                })
            }
        }
        fetchUser(isModalOpen.userId);
    }, [])
    return (
        <>
            <Modal
                width={500}
                title="Update User"
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
                        form={form} layout="horizontal" name="modalForm"
                        style={{
                            width: '100%'
                        }}
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
                            labelCol={{ span: 4 }}
                            name="name"
                            rules={[{ required: true, message: "Please enter name!" }]}
                        >
                            <Input placeholder="Enter name" />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            labelCol={{ span: 4 }}
                            name="email"
                            rules={[{ required: true, message: "Please enter email!" }]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Gender"
                            labelCol={{ span: 4 }}
                            name="gender"
                            rules={[{ required: true, message: "Please enter email!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select gender"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    { value: 'MALE', label: 'MALE' },
                                    { value: 'FEMALE', label: 'FEMALE' }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            labelCol={{ span: 4 }}
                            name="address"
                            rules={[{ required: true, message: "Please enter address!" }]}
                        >
                            <Input placeholder="Enter address" />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            labelCol={{ span: 4 }}
                            name="phone"
                            rules={[{ required: true, message: "Please enter phone!" }]}
                        >
                            <Input placeholder="Enter phone" />
                        </Form.Item>
                        <Form.Item
                            label="Role"
                            labelCol={{ span: 4 }}
                            name="role"
                            rules={[{ required: true, message: "Please enter role!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select role"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={roleList}
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default EditUserModal;
