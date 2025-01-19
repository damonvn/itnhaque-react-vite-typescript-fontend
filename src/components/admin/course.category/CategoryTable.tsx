import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Button, notification, Pagination, Popover, Table } from 'antd';
import { callDeleteCategory, callFetchCategoriesPagination } from '@/config/api';
import '@/styles/antd-table-custom.scss'
import { ICategory } from '@/types/backend';
import AddCategoryModal from './AddCategoryMadal';
import EditCategoryModal from './EditCategoryModal';



interface IEdit {
    isOpened: boolean,
    categoryId: number
}




const CategoryTable = () => {
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState<IEdit>({ isOpened: false, categoryId: -1 });
    const [data, setData] = useState<ICategory[]>([]);
    const [total, setTotal] = useState<number>();
    const [pageSize, setPageSize] = useState<number>(4);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [openPopver, setOpenPopver] = useState<{ [key: number]: boolean }>({});

    const onChangePagination = (cp: number, ps: number) => {
        if (cp !== currentPage) setCurrentPage(cp);
        if (ps !== pageSize) setPageSize(ps);
    }

    const fetchData = async (sort: string = "") => {
        let queryParams = `?page=${currentPage}&size=${pageSize}`
        if (sort) {
            queryParams += `${sort}`
        }
        const res = await callFetchCategoriesPagination(queryParams)
        if (res?.data?.result) {
            const categories: ICategory[] = [];
            //@ts-ignore
            res.data.result.map((item) => {
                categories.push({
                    id: item.id,
                    name: item.name,
                    value: item.value
                })
            })
            setData(categories);
            setTotal(res.data.meta.total);
        }
    }

    const handleDelete = async (id: number) => {
        const res = await callDeleteCategory(id)
        if (res.statusCode === 200) {
            fetchData();
            notification.success({
                message: 'Delete role successfully!'
            })
        } else if (res.statusCode === 500) {
            notification.error({ message: 'It cannot be deleted because a 500 error occurred on the server.' })
        }
    }
    useEffect(() => {
        fetchData();
    }, [pageSize, currentPage])

    const columns: TableColumnsType<ICategory> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
            sortDirections: ['ascend', 'descend',]
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
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: '25%',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Action',
            key: 'action',
            width: '40%',
            render: (_, record) => (
                <div>
                    <button
                        className='table-edit-btn'
                        onClick={() => setEditModal({ isOpened: true, categoryId: record.id })}
                    >
                        <EditOutlined />
                    </button>
                    <Popover
                        open={openPopver[record.id]}
                        placement="left"
                        content={
                            <div style={{ display: 'flex', justifyContent: 'left', gap: '15px', marginTop: '15px' }}>
                                <button
                                    style={{ padding: '2px 10px', cursor: 'pointer', minWidth: '50px' }}
                                    onClick={() => {
                                        handleDelete(record.id);
                                        setOpenPopver({});
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
                        trigger="click" >
                        <button
                            className='table-delete-btn'
                            onClick={() => setOpenPopver({ [record.id]: true })}
                        >
                            <DeleteOutlined />
                        </button>
                    </Popover >

                </div >
            ),
        },
    ];

    return (
        <div className='antd-table-custom'>
            <div className='header'>
                <div style={{ fontWeight: 'bold' }}>Category Manage</div>
                <Button
                    style={{ borderRadius: '3px', marginRight: '5px' }}
                    onClick={() => setAddModal(true)}
                >
                    <PlusOutlined />
                    Add Category
                </Button>

            </div>
            <Table<ICategory>
                columns={columns}
                dataSource={data}
                pagination={false}
                style={{ boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.1)' }}
            />
            <Pagination
                style={{ marginTop: '30px', justifyContent: 'right' }}
                showSizeChanger
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={(p, s) => onChangePagination(p, s)}
            />
            {addModal && <AddCategoryModal isModalOpen={addModal} setIsModalOpen={setAddModal} />}
            {editModal.isOpened && <EditCategoryModal isModalOpen={editModal} setIsModalOpen={setEditModal} fetchData={fetchData} />}
        </div>
    );
}

export default CategoryTable;