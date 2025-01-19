import { Card, Checkbox, Col, Form, Row } from 'antd';
import './home.scss'
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchAllSkills, callFetClientCourses } from '@/config/api';
import { ICourseClientArray, ISkill } from '@/types/backend';
import toSlug from '@/config/toSlug';




type MenuItem = Required<MenuProps>['items'][number];


const HomePage = () => {
    const [current, setCurrent] = useState('all');
    const [courses, setCourses] = useState<ICourseClientArray>([])
    const [skills, setSkills] = useState<ISkill[]>([])

    const [form] = Form.useForm();

    const items: MenuItem[] = [
        {
            key: 'all',
            label: (
                <a
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => fetchCourses()}
                >
                    Tất cả
                </a>
            ),
        },
        {
            key: 'two',
            label: (
                <a
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => fetchCourses(`filter=category.value='frontend'`)}
                >
                    Frontend
                </a>
            ),
        },
        {
            key: 'three',
            label: (
                <a
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => fetchCourses(`filter=category.value='backend'`)}
                >
                    Backend
                </a>
            ),
        }
    ];


    const onClickTopMenu: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        form.resetFields();
    };

    const handleLeftMenuOnchange = (_: any, values: any) => {
        if (values.skills.length > 0) {
            let filter = 'filter=';
            values.skills.map((skill: string, index: number) => {
                if (index < values.skills.length - 1) {
                    filter += `skill.value='${skill}' or `
                } else {
                    filter += `skill.value='${skill}'`
                }
            })
            setCurrent('');
            fetchCourses(filter);
        } else {
            setCurrent('');
            fetchCourses();
        }
    }

    const fetchCourses = async (filter?: string) => {
        let queryParams = 'page=1&size=100'
        if (filter) {
            queryParams += `&${filter}`;
        }
        const res = await callFetClientCourses(queryParams);
        if (res?.data) {
            //@ts-ignore
            setCourses(res.data.result);
        }
    }

    const fetchSkills = async () => {
        const res = await callFetchAllSkills();
        if (res.statusCode === 200 && res?.data) {
            setSkills(res.data);
        }
    }
    useEffect(() => {
        fetchCourses();
        fetchSkills();
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
                            // src="/it-nha-que-logo2.png" alt="IT NHA QUE"
                            // src="/number_44622925.png" alt="IT NHA QUE"
                            // src="/logoqletter.png" alt="IT NHA QUE"
                            // src="/logoqleaf123.png" alt="IT NHA QUE"
                            src="/green-q-logo.png" alt="IT NHA QUE"
                            // src="/logo-q-home-page.png" alt="IT NHA QUE"
                            style={{ width: '40px', marginTop: '6px', marginRight: '100px', marginLeft: '10px', opacity: 0.9 }}
                        />
                    </div>
                    {/* <div className='header-menu-item'>Full Stack</div>
                    <div className='header-menu-item'>Front End</div>
                    <div className='header-menu-item'>Back End</div> */}
                    <Menu style={{ height: '58px', lineHeight: '58px', marginTop: '2px' }} onClick={onClickTopMenu} selectedKeys={[current]} mode="horizontal" items={items} />
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
                            onValuesChange={(changedValues, values) => handleLeftMenuOnchange(changedValues, values)}
                        >
                            <Form.Item
                                name='skills'
                                label={<span style={{ fontWeight: 600, fontSize: '18px', marginTop: '15px', marginLeft: '4px' }}>Chọn theo kỹ năng</span>}
                                labelCol={{ span: 24 }}
                            >
                                <Checkbox.Group>
                                    <Row>
                                        {skills.length > 0 && skills.map((item) => {
                                            return (
                                                <Col
                                                    key={item.id}
                                                    className='home-left-menu-item'
                                                    span={24}
                                                >
                                                    <Checkbox
                                                        className='custom-checkbox'
                                                        value={item.value}
                                                    >
                                                        {item.name}
                                                    </Checkbox>
                                                </Col>
                                            );

                                        })}
                                        {/* <Col
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
                                        </Col> */}
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
                        <div style={{ paddingLeft: '30px', width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: '24px', minHeight: '100vh', marginLeft: '-15px', marginRight: '-15px' }}>
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
                                            onClick={() => window.location.href = `/khoa-hoc/${toSlug(course.title)}/bai-hoc/${course.id}`}
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
