import { Input, Modal, Form, notification } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { callChangeUserPassword } from '@/config/api';
import { IUserChangePassword } from '@/types/backend';

interface IState {
    isOpened: boolean,
    userId: number
}

interface IProps {
    isModalOpen: IState;
    setIsModalOpen: Dispatch<SetStateAction<IState>>;
}


const ChangeUserPasswordModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [form] = Form.useForm();
    const handleOk = async () => {
        try {
            // Validate form fields
            const values = await form.validateFields();
            const updateUser: IUserChangePassword = {
                id: values.id,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            };

            const res = await callChangeUserPassword(updateUser);
            if (res?.statusCode === 200) {
                setIsModalOpen({ isOpened: false, userId: -1 });
                form.resetFields();
                notification.success({
                    message: 'Password changed successfully!'
                })
            } else if (res?.statusCode === 401) {
                notification.error({
                    message: 'Incorrect password.'
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
        form.setFieldsValue({
            id: isModalOpen.userId
        })
    }, [])

    const validatePasswords = (_: any, value: string) => {
        if (value && value !== form.getFieldValue('newPassword')) {
            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
        }
        return Promise.resolve();
    };


    return (
        <>
            <Modal
                width={500}
                title="Change Password"
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
                            label="Old Password"
                            labelCol={{ span: 24 }}
                            name="oldPassword"
                            rules={[{ required: true, message: "Please enter old password!" }]}
                        >
                            <Input placeholder="Enter old password" />
                        </Form.Item>
                        <Form.Item
                            label="New Password"
                            labelCol={{ span: 24 }}
                            name="newPassword"
                            rules={[{ required: true, message: "Please enter new password!" }]}
                        >
                            <Input.Password placeholder="Enter new password" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                { validator: validatePasswords },
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input.Password />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ChangeUserPasswordModal;
