import { Card, Checkbox, Col, Form, Row } from 'antd';
import './home.scss'
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { callFetClientCourses } from '@/config/api';
import { ICourseClientArray } from '@/types/backend';




type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'all',
        label: (
            <a target="_blank" rel="noopener noreferrer">
                TẤT CẢ
            </a>
        ),
    },
    {
        key: 'two',
        label: (
            <a target="_blank" rel="noopener noreferrer">
                FRONTEND
            </a>
        ),
    },
    {
        key: 'three',
        label: (
            <a target="_blank" rel="noopener noreferrer">
                BACKEND
            </a>
        ),
    }
];



const HomePage = () => {
    const [current, setCurrent] = useState('all');
    const [courses, setCourses] = useState<ICourseClientArray>([])
    const [form] = Form.useForm();

    const onClickTopMenu: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        form.resetFields();
    };

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await callFetClientCourses();
            if (res?.data) {
                setCourses(res.data);
            }
        }
        fetchCourses();
    }, [])
    return (
        <div>
            <header
                className='home-header pd-l-ss pd-r-ss pd-l-1 pd-r-1 pd-l-2 pd-r-2'
            >
                <div
                    style={{ display: 'flex', width: '100%', boxSizing: 'border-box' }}
                    className='home-header-content'
                >
                    <div className='header-logo'>
                        <img
                            src="/it-nha-que-logo2.png" alt="IT NHA QUE"
                            style={{ width: '120px', marginTop: '0px', marginRight: '50px', marginLeft: '15px' }}
                        />
                    </div>
                    {/* <div className='header-menu-item'>Full Stack</div>
                    <div className='header-menu-item'>Front End</div>
                    <div className='header-menu-item'>Back End</div> */}
                    <Menu style={{ height: '53px', lineHeight: '53px', marginTop: '7px', fontSize: '12px' }} onClick={onClickTopMenu} selectedKeys={[current]} mode="horizontal" items={items} />
                </div>
            </header>
            <div
                style={{ height: '100vh', marginTop: '90px', }}
                className='home-content pd-l-ss pd-r-ss pd-l-1 pd-r-1 pd-l-2 pd-r-2'
            >
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', boxSizing: 'border-box' }}>
                    <div
                        style={{ width: '20%' }}
                    >
                        <Form
                            form={form}
                            className='home-left-menu l-ss l-1'
                            style={{ border: '1px solid #e8ebed', padding: '10px', width: '100%', borderRadius: '3px', }}
                            onValuesChange={(changedValues, values) => {
                                if (values.category.length === 0) {
                                    setCurrent('all');
                                } else {
                                    setCurrent('');
                                }


                            }}>
                            <Form.Item
                                name='category'
                                label={<span style={{ fontWeight: 600, fontSize: '18px', marginTop: '15px', marginLeft: '4px' }}>Chọn theo kỹ năng</span>}
                                labelCol={{ span: 24 }}
                            >
                                <Checkbox.Group>
                                    <Row>
                                        <Col
                                            className='home-left-menu-item'
                                            span={24}
                                        >
                                            <Checkbox
                                                className='custom-checkbox'
                                                value={'backendJava'}
                                            >
                                                Backend Java
                                            </Checkbox>
                                        </Col>
                                        <Col
                                            className='home-left-menu-item'
                                            span={24}
                                        >
                                            <Checkbox
                                                className='custom-checkbox'
                                                value={'frontendReactJS'}
                                            >
                                                Frontend ReactJS
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </Form>
                    </div>
                    <div
                        style={{
                            width: '80%', paddingLeft: '25px', boxSizing: 'border-box'
                        }}
                        className='home-course-container'
                    >
                        <div style={{ height: '150vh', paddingLeft: '30px', width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: '24px', height: '200vh', marginLeft: '-15px', marginRight: '-15px' }}>
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        style={{ width: '33.333%', flexWrap: 'wrap', paddingLeft: '15px', paddingRight: '15px', boxSizing: 'border-box' }}
                                    >
                                        <Card
                                            style={{ width: '100%', cursor: 'pointer' }}
                                            cover={
                                                <img
                                                    style={{ width: '100%' }}
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/course/${course.image}`}
                                                />
                                            }
                                            onClick={() => window.location.href = `/course/lesson/${course.id}`}
                                        >
                                            <div
                                                style={{
                                                    marginTop: '-10px',
                                                    marginLeft: '-12px',
                                                    marginRight: '-12px',
                                                    marginBottom: '28px',
                                                    // border: '1px solid red',
                                                    height: '130px',
                                                }}
                                            >
                                                <div className='course-title'>
                                                    {course.title}
                                                </div>
                                                <div className='course-discripttion'>
                                                    {course.description}
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;