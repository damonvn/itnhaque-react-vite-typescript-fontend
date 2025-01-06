import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import './LoginPage.scss'
import { callLogin } from '@/config/api';
import { ILogin, IAccount } from '@/types/backend';
import { useDispatch, useSelector } from 'react-redux';
import { setUerLoginInfor } from '@/redux/slices/accountSlice';
import { useLocation } from 'react-router-dom';

const LoginPage = () => {
    const dispatch = useDispatch();
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");
    console.log('check params: ', params);
    console.log('check callback: ', callback);

    const onFinish: FormProps<ILogin>['onFinish'] = async (values) => {
        const user: ILogin = {
            username: values.username,
            password: values.password
        }
        const res = await callLogin(user);
        if (res?.data) {
            localStorage.setItem('access_token', res.data.accessToken);
            const userPayload: IAccount = {
                id: res.data.user.id,
                email: res.data.user.email,
                name: res.data.user.name,
                role: res.data.user.role,
            }
            dispatch(setUerLoginInfor(userPayload));
            // message.success('Đăng nhập tài khoản thành công!');
            window.location.href = callback ? callback : '/admin/course';
        }
    };

    const onFinishFailed: FormProps<ILogin>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Form
                name="basic"
                layout="vertical"
                style={{ minWidth: 400 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className='login-form'
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item label={null} wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: '24px' }}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default LoginPage;