
import { Input, Modal, Form, Select } from 'antd';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { callCreateUser, callFetchAllRoles } from '@/config/api';
import { IUserCreate } from '@/types/backend';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    fetchData: (sort?: string) => Promise<void>;
}

interface IRoleSelect {
    value: number,
    label: string
}


const AddUserModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen, fetchData }) => {

    const [roleList, setRoleList] = useState<IRoleSelect[]>([]);

    const [form] = Form.useForm();


    const handleOk = async () => {
        try {
            // Validate form fields
            const values = await form.validateFields();
            const newUser: IUserCreate = {
                name: values.name,
                email: values.email,
                password: values.password,
                gender: values.gender,
                address: values.address,
                phone: values.phone,
                role: {
                    id: values.role
                }
            };

            const resCourse = await callCreateUser(newUser);
            if (resCourse && resCourse.data) {
                fetchData('&sort=createdAt,desc');
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

    return (
        <>
            <Modal
                width={500}
                title="Add New User"
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
                        form={form} layout="horizontal" name="modalForm"
                        style={{
                            width: '100%'
                        }}
                    //borderLeft: '1px solid #dedede'
                    >
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
                            <Input placeholder="Enter email" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            labelCol={{ span: 4 }}
                            name="password"
                        >
                            <Input.Password placeholder="Enter password" />
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

export default AddUserModal;
