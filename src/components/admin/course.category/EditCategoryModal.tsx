import { Input, Modal, Form, notification } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { callFetchCategoryById, callUpdateCategory, } from '@/config/api';
import { ICategory } from '@/types/backend';

interface IEdit {
    isOpened: boolean,
    categoryId: number

}

interface IProps {
    isModalOpen: IEdit;
    setIsModalOpen: Dispatch<SetStateAction<IEdit>>;
    fetchData: (sort?: string) => Promise<void>;
}

const EditCategoryModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen, fetchData }) => {

    const [form] = Form.useForm();
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newCategory: ICategory = {
                id: values.id,
                name: values.name,
                value: values.value
            };
            const res = await callUpdateCategory(newCategory);
            if (res.statusCode === 200) {
                fetchData();
                setIsModalOpen({ isOpened: false, categoryId: -1 });
                form.resetFields();
            } else if (res.statusCode === 500) {
                notification.error({ message: 'It cannot be deleted because a 500 error occurred on the server.' })
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
        setIsModalOpen({ isOpened: false, categoryId: -1 });
        form.resetFields();
    };

    const fetchCategoryById = async (id: number) => {
        const res = await callFetchCategoryById(id);
        if (res?.data) {
            form.setFieldsValue({
                id: res.data.id,
                name: res.data.name,
                value: res.data.value,
            });
        }
    }

    useEffect(() => {
        fetchCategoryById(isModalOpen.categoryId)
    }, [])

    return (
        <Modal
            width={500}
            title="Update Category"
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
                        label="Value"
                        name="value"
                        rules={[{ required: true, message: "Please enter value!" }]}
                    >
                        <Input placeholder="Enter value" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default EditCategoryModal;
