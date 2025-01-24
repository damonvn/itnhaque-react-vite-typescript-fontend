import { Card, Checkbox, Col, Form, Row } from 'antd';
import './home.scss'
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { callFetchAllCategories, callFetchAllSkills, callFetClientCourses } from '@/config/api';
import { ICategory, ICourseClient, ISkill } from '@/types/backend';
import toSlug from '@/config/toSlug';
import MobileMenu from '@/components/client/home/MobileMenu';
import { LineStrokeColorVar } from 'antd/es/progress/style';

type MenuItem = Required<MenuProps>['items'][number];

interface CategoryMenuItem {
    key: string;
    label: ReactNode
}

const HomePage = () => {
    const [current, setCurrent] = useState('all');
    const [courses, setCourses] = useState<ICourseClient[]>([])
    const [skills, setSkills] = useState<ISkill[]>([])
    const [highlight, setHighlight] = useState<{ [key: string]: boolean }>({ [-1]: true })
    const [categories, setCategories] = useState<ICategory[]>([])
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
        console.log('check res: callFetClientCourses: ', res);
        if (res?.data) {
            //@ts-ignore
            setCourses(res.data.result);
        }
    }

    const fetchCategories = async () => {
        const res = await callFetchAllCategories();
        console.log('check callFetchAllSkills res: ', res);
        if (res.statusCode === 200 && res?.data) {
            let data: ICategory[] = [{ id: -1, name: 'Tất cả', value: 'all' }];
            data = [...data, ...res.data]
            setCategories(data);
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
        fetchCategories();
        fetchSkills();
    }, [])
    return (
        <div>
            <header
                className='home-header pd-l-ss pd-r-ss pd-l-1 pd-r-1 pd-l-2 pd-r-2'
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <div
                    style={{ display: 'flex', width: '100%', boxSizing: 'border-box' }}
                    className='home-header-content'
                >
                    <div
                        onClick={() => window.location.href = '/'}
                        className='header-logo'
                    >
                        <img
                            src="it-nha-que-home-logo.png" alt="Home"
                            style={{ width: '37px', marginRight: '5px', marginLeft: '10px', opacity: 0.9, fontSize: '35px', color: '#fff' }}
                        />
                        <span style={{ fontFamily: 'Impact', fontStyle: 'italic', fontSize: '13px', marginBottom: '-30px', marginRight: '48px', opacity: 0.9, color: '#B8860B' }}>It nhà quê</span>
                    </div>
                    {/* <Menu
                        className='home-header-menu-responsive'
                        style={{ height: '58px', lineHeight: '58px', marginTop: '2px' }}
                        onClick={onClickTopMenu}
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={items}
                    /> */}
                    <ul
                        className='home-header-menu home-header-menu-responsive'
                        style={{ height: '58px', lineHeight: '58px' }}
                    >
                        {
                            categories.length > 0 && categories.map((c) => {
                                return (
                                    <li
                                        key={c.id}
                                        onClick={() => {
                                            if (c.value == 'all') {
                                                fetchCourses();
                                            } else {
                                                fetchCourses(`filter=category.value='${c.value}'`)
                                            }
                                            setHighlight({ [c.id]: true });
                                        }}
                                    >
                                        <span className={`${highlight[c.id] ? 'current-home-menu-item' : ''}`}>{c.name}</span>
                                    </li>
                                );
                            })
                        }
                    </ul>

                </div>
                <MobileMenu />
            </header>

            <div
                style={{ minHeight: '100vh', marginTop: '90px', }}
                className='home-content pd-l-ss pd-r-ss pd-l-1 pd-r-1 pd-l-2 pd-r-2'
            >
                <div
                    className='home-content-container-responsive'
                    style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}
                >
                    <div
                        style={{ width: '25%', paddingRight: '45px', boxSizing: 'border-box' }}
                        className='leftmenu-responsive'
                    >
                        <Form
                            form={form}
                            className='l-ss l-1 left-form-ismoblie'
                            style={{ border: '1px solid #e8ebed', padding: '10px', width: '100%', borderRadius: '3px', position: 'sticky', top: '90px' }}
                            onValuesChange={(changedValues, values) => handleLeftMenuOnchange(changedValues, values)}
                        >
                            <div
                                style={{
                                    fontWeight: 600, fontSize: '17px', marginTop: '15px', marginLeft: '4px', marginBottom: '7px'
                                }}
                            >
                                Chọn theo kỹ năng
                            </div>
                            <Form.Item
                                name='skills'
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
                            width: '75%', boxSizing: 'border-box'
                        }}
                        className='home-course-responsive'
                    >
                        <div style={{ width: '100%', boxSizing: 'border-box' }}>
                            <div
                                className='home-course-container home-course-container-responsive'
                                style={{ display: 'flex', flexWrap: 'wrap', rowGap: '50px', marginLeft: '-15px', marginRight: '-15px' }}
                            >
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        style={{ width: '33.333%', flexWrap: 'wrap', paddingLeft: '15px', paddingRight: '15px', boxSizing: 'border-box' }}
                                        className='homecard-responsive'
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
                                            onClick={() => window.location.href = `/khoa-hoc/${toSlug(course.title)}/bai-hoc/${course.firstLessonId}`}
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