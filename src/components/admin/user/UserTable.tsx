import { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, notification, Pagination, Popover, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { callDelelteUser, callFetchUsers } from '@/config/api';
import './User.scss'
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

interface UserType {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface IEdit {
    isOpened: boolean,
    userId: number
}

type DataIndex = keyof { name: string };

const UserTable = () => {
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [editModal, setEditModal] = useState<IEdit>({ isOpened: false, userId: -1 });
    const [data, setData] = useState<UserType[]>([]);
    const [totalUsers, setTotalUsers] = useState<number | undefined>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [openPopver, setOpenPopver] = useState<{ [key: number]: boolean }>({});
    const searchInput = useRef<InputRef>(null);

    const onChangePagination = (cp: number, ps: number) => {
        const abcd = currentPage;
        if (cp !== abcd) setCurrentPage(cp);
        if (ps !== pageSize) setPageSize(ps);
    }
    const fetchData = async (sort?: string) => {
        let queryParams = `?page=${currentPage}&size=${pageSize}`
        if (sort) {
            queryParams += `${sort}`;
        }
        const res = await callFetchUsers(queryParams);
        if (res.data?.result) {
            const resUsers: UserType[] = [];
            //@ts-ignore
            res.data.result.map((item) => {
                resUsers.push({
                    id: item.id.toString(),
                    name: item.name,
                    email: item.email,
                    role: item.role?.name
                })
            })
            setData(resUsers);
            setTotalUsers(res.data.meta.total);
        }
    }
    useEffect(() => {
        const queryParams = `?page=${currentPage}&size=${pageSize}`
        fetchData(queryParams);
    }, [pageSize, currentPage])

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<UserType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: TableColumnsType<UserType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            sorter: (a, b) => a.id.localeCompare(b.id),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '25%',
            sorter: (a, b) => a.email.localeCompare(b.email),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'role',
            dataIndex: 'role',
            key: 'role',
            sorter: (a, b) => a.role.localeCompare(b.role),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Action',
            key: 'action',
            width: '30%',
            render: (_, record) => (
                <div>
                    <button
                        className='table-edit-btn'
                        onClick={() => {
                            setEditModal({ isOpened: true, userId: +record.id });
                        }}
                    >
                        <EditOutlined />
                    </button>
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

    const handleDelete = async (id: number) => {
        const res = await callDelelteUser(id);
        if (res.statusCode === 200) {
            fetchData();
        } else if (res.statusCode === 500) {
            notification.error({ message: 'It cannot be deleted because a 500 error occurred on the server.' })
        }
    }

    return (
        <div className='antd-table-custom'>
            <div className='header'>
                <div style={{ fontWeight: 'bold' }}>User Manage</div>
                <Button
                    style={{ borderRadius: '3px', marginRight: '5px' }}
                    onClick={() => setAddUserModalOpen(true)}
                >
                    <PlusOutlined />
                    Add User
                </Button>

            </div>
            <Table<UserType>
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
            {addUserModalOpen && <AddUserModal isModalOpen={addUserModalOpen} setIsModalOpen={setAddUserModalOpen} fetchData={fetchData} />}
            {editModal.isOpened && <EditUserModal isModalOpen={editModal} setIsModalOpen={setEditModal} fetchData={fetchData} />}
        </div>
    );
}

export default UserTable;