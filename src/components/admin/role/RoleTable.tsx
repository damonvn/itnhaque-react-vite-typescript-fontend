import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Button, notification, Pagination, Table } from 'antd';

import { callDeleteRole, callFetchRoles } from '@/config/api';
import '@/styles/antd-table-custom.scss'
import AddRoleModal from './AddRoleModal';
import EditRoleModal from './EditRoleModal';

interface RoleType {
    id: string;
    name: string;
}

interface IEdit {
    isOpened: boolean,
    roleId: number
}

const RoleTable = () => {
    const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);
    const [editModal, setEditModal] = useState<IEdit>({ isOpened: false, roleId: -1 });
    const [data, setData] = useState<RoleType[]>([]);
    const [totalUsers, setTotalUsers] = useState<number | undefined>();
    const [pageSize, setPageSize] = useState<number | undefined>(10);
    const [currentPage, setCurrentPage] = useState<number | undefined>(1);

    const onChangePagination = (cp: number, ps: number) => {
        const abcd = currentPage;
        if (cp !== abcd) setCurrentPage(cp);
        if (ps !== pageSize) setPageSize(ps);
    }

    const fetchUsers = async (query: string) => {
        const res = await callFetchRoles(query);
        if (res?.data?.result) {
            const resUsers: RoleType[] = [];
            //@ts-ignore
            res.data.result.map((item) => {
                resUsers.push({
                    id: item.id.toString(),
                    name: item.name
                })
            })
            setData(resUsers);
            setTotalUsers(res.data.meta.total);
        }
    }

    // const handleEdit = (record: any) => {

    // }

    const handleDelete = async (record: any) => {

        console.log('record: ', record);
        const id: number = record.id;
        const res = await callDeleteRole(+id)
        if (res.statusCode === 200) {
            const queryParams = `?page=${currentPage}&size=${pageSize}`
            fetchUsers(queryParams);
            notification.success({
                message: 'Delete role successfully!'
            })
        }
    }
    useEffect(() => {

        const queryParams = `?page=${currentPage}&size=${pageSize}`
        fetchUsers(queryParams);
    }, [pageSize, currentPage])

    const columns: TableColumnsType<RoleType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '20%',
            sorter: (a, b) => a.id.localeCompare(b.id),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <div>
                    <button
                        className='table-edit-btn'
                        onClick={() => setEditModal({ isOpened: true, roleId: +record.id })}
                    >
                        <EditOutlined />
                    </button>
                    <button
                        className='table-delete-btn'
                        onClick={() => handleDelete(record)}
                    >
                        <DeleteOutlined />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className='admin-role-table antd-table-custom'>
            <div className='header'>
                <div style={{ fontWeight: 'bold' }}>Role Manage</div>
                <Button
                    style={{ borderRadius: '3px', marginRight: '5px' }}
                    onClick={() => setAddRoleModalOpen(true)}
                >
                    <PlusOutlined />
                    Add Role
                </Button>

            </div>
            <Table<RoleType>
                columns={columns} dataSource={data} pagination={false}
                style={{ boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.1)' }}
            />
            <Pagination
                style={{ marginTop: '30px', justifyContent: 'right' }}
                showSizeChanger
                current={currentPage}
                total={totalUsers}
                pageSize={pageSize}
                onChange={(p, s) => onChangePagination(p, s)}
            />
            {addRoleModalOpen && <AddRoleModal isModalOpen={addRoleModalOpen} setIsModalOpen={setAddRoleModalOpen} />}
            {editModal.isOpened && <EditRoleModal isModalOpen={editModal} setIsModalOpen={setEditModal} />}
        </div>
    );
}

export default RoleTable;