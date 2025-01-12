import { useEffect, useRef, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Pagination, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { callFetchUsers } from '@/config/api';
import './User.scss'
import AddUserModal from './AddUserModal';

interface UserType {
    id: string;
    name: string;
    email: string;
    role: string;
}

type DataIndex = keyof { name: string };

const UserTable = () => {
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [data, setData] = useState<UserType[]>([]);
    const [totalUsers, setTotalUsers] = useState<number | undefined>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const onChangePagination = (cp: number, ps: number) => {
        const abcd = currentPage;
        if (cp !== abcd) setCurrentPage(cp);
        if (ps !== pageSize) setPageSize(ps);
    }
    const fetchUsers = async (query: string) => {
        const res = await callFetchUsers(query);
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
        fetchUsers(queryParams);
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend',]
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
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
    ];

    return (
        <div className='admin-user-table'>
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
            {addUserModalOpen && <AddUserModal isModalOpen={addUserModalOpen} setIsModalOpen={setAddUserModalOpen} />}
        </div>
    );
}

export default UserTable;