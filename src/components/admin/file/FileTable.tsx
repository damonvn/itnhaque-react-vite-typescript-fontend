import { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { notification, Pagination, Popover, Table } from 'antd';

import { callDeleteFile, callFetchAllFilesPagination } from '@/config/api';
import '@/styles/antd-table-custom.scss'
import { IFile } from '@/types/backend';

const FileTable = () => {
    const [data, setData] = useState<IFile[]>([]);
    const [totalUsers, setTotalUsers] = useState<number | undefined>();
    const [pageSize, setPageSize] = useState<number | undefined>(10);
    const [currentPage, setCurrentPage] = useState<number | undefined>(1);
    const [openPopver, setOpenPopver] = useState<{ [key: number]: boolean }>({});

    const onChangePagination = (cp: number, ps: number) => {
        const abcd = currentPage;
        if (cp !== abcd) setCurrentPage(cp);
        if (ps !== pageSize) setPageSize(ps);
    }

    const fetchFiles = async (query: string) => {
        const res = await callFetchAllFilesPagination(query);
        if (res?.data?.result) {
            console.log('check callFetchAllFilesPagination res: ', res);
            setData(res.data.result);
            setTotalUsers(res.data.meta.total);
        }
    }

    const handleDelete = async (id: number) => {

        const res = await callDeleteFile(id)
        console.log('check callDeleteFile res: ', res);
        if (res.statusCode === 200 && res.data === true) {
            const queryParams = `?page=${currentPage}&size=${pageSize}`
            fetchFiles(queryParams);
            notification.success({
                message: 'Delete file successfully!'
            })
        } else if (res.statusCode === 500) {
            notification.error({ message: 'It cannot be deleted because a 500 error occurred on the server.' })
        }
    }

    useEffect(() => {
        const queryParams = `?page=${currentPage}&size=${pageSize}`
        fetchFiles(queryParams);
    }, [pageSize, currentPage])

    const columns: TableColumnsType<IFile> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Folder',
            dataIndex: 'folder',
            key: 'folder',
            width: '10%',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '25%',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
            render: (_, record) => (
                <div>
                    <Popover
                        open={openPopver[+record.id]}
                        placement="left"
                        content={
                            <div style={{ display: 'flex', justifyContent: 'left', gap: '15px', marginTop: '15px' }}>
                                <button
                                    style={{ padding: '2px 10px', cursor: 'pointer', minWidth: '50px' }}
                                    onClick={() => {
                                        handleDelete(+record.id);
                                        setOpenPopver({})
                                    }}
                                >
                                    Yes
                                </button>
                                <button style={{ padding: '2px 10px', cursor: 'pointer', minWidth: '50px' }}
                                    onClick={() => setOpenPopver({})}
                                >
                                    No
                                </button>
                            </div>
                        }
                        title="Do you want to delete?"
                        trigger="click"
                    >
                        <button
                            className='table-delete-btn'
                            onClick={() => setOpenPopver({ [record.id]: true })}
                        >
                            <DeleteOutlined />
                        </button>
                    </Popover>
                </div>
            ),
        },
    ];

    return (
        <div className='admin-role-table antd-table-custom'>
            <div className='header'>
                <div style={{ fontWeight: 'bold' }}>File Manage</div>
            </div>
            <Table<IFile>
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
        </div>
    );
}

export default FileTable;