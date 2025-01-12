import React, { useState } from 'react';
import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    BookOutlined,
    ReadOutlined,
    BulbOutlined,
    ProductOutlined,
    MoonOutlined
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Dropdown, theme } from 'antd';
import '@/styles/admin-layout-custom.scss'
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { callLogout } from '@/config/api';
import { useNavigate, useLocation } from 'react-router-dom';



const logoutMenu = () => {
    const logoutHandle = async () => {
        const res = await callLogout();
        if (res.statusCode === 200) {
            window.location.href = '/login';
            localStorage.removeItem('access_token');
        }
    }
    return (<Menu
        onClick={() => logoutHandle()}
    >
        <Menu.Item key="1" icon={<LogoutOutlined />}>
            Logout
        </Menu.Item>
    </Menu>);

}

const { Header, Sider, Content } = Layout;

const AdminPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const accountState = useSelector((state: any) => state.account);
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const childPath = path.startsWith('/admin/') ? path.replace('/admin/', '') : null;

    return (
        <div className='admin-layout-custom'>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div style={{ color: "white", padding: "15px" }}>
                        <div style={{ height: "49px", lineHeight: "49px", color: "white", textAlign: "center", fontSize: "20px", borderBottom: "1px solid #d7caca" }}>
                            Admin
                        </div>
                    </div>
                    <Menu
                        style={{ marginTop: '16px' }}
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[`${childPath ? childPath : 'course'}`]}
                        items={[
                            {
                                key: 'course',
                                icon: <ReadOutlined />,
                                label: 'Course Manage',
                                onClick: () => navigate('course')
                            },
                            {
                                key: 'user',
                                icon: <UserOutlined />,
                                label: 'User Manage',
                                onClick: () => navigate('user')
                            },
                            {
                                key: 'role',
                                icon: <BulbOutlined />,
                                label: 'Role Manage',
                                onClick: () => navigate('role')
                            },
                            {
                                key: 'category',
                                icon: <ProductOutlined />,
                                label: 'Category Manage',
                                onClick: () => navigate('category')
                            },
                            {
                                key: 'skill',
                                icon: <MoonOutlined />,
                                label: 'Skill Manage',
                                onClick: () => navigate('skill')
                            },
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Dropdown overlay={logoutMenu} trigger={['hover']} placement="bottomRight">
                            <Avatar size={40} style={{ marginRight: '50px', cursor: 'pointer' }}>{accountState.name}</Avatar>
                        </Dropdown>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </div>

    );
};

export default AdminPage;