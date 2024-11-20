import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

import '@/styles/admin-layout-custom.scss'
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <div className='admin-layout-custom'>
            {/* <div style={{ height: "60px", width: "100vw", background: "green", position: "fixed", zIndex: 100, top: 0 }}></div> */}
            <Layout>

                <Sider trigger={null} collapsible collapsed={collapsed}>
                    {/* <div className="demo-logo-vertical" /> */}
                    <div style={{ color: "white", padding: "5px" }}>
                        <div style={{ height: "59px", lineHeight: "59px", color: "white", textAlign: "center", fontSize: "20px", borderBottom: "1px solid white" }}>
                            Admin
                        </div>
                    </div>
                    <Menu
                        // style={{ position: "fixed", zIndex: 50, top: 60 }}
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={[
                            {
                                key: '1',
                                icon: <UserOutlined />,
                                label: 'nav 1',
                            },
                            {
                                key: '2',
                                icon: <VideoCameraOutlined />,
                                label: 'nav 2',
                            },
                            {
                                key: '3',
                                icon: <UploadOutlined />,
                                label: 'nav 3',
                            },
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
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

export default AdminLayout;