import { Card, Checkbox, Col, Form, Row } from 'antd';
import './home.scss'
import { useEffect, useState } from 'react';
import { callFetchAllCategories, callFetchAllSkills, callFetClientCourses } from '@/config/api';
import { ICategory, ICourseClient, ISkill } from '@/types/backend';
import toSlug from '@/config/toSlug';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import RightArrow from '@/components/client/home/RightArrow';




const HomePage = () => {
    const [courses, setCourses] = useState<ICourseClient[]>([])
    const [skills, setSkills] = useState<ISkill[]>([])
    const [menuHighlight, setMenuHighlight] = useState<{ [key: string]: boolean }>({ [-1]: true })
    const [categories, setCategories] = useState<ICategory[]>([])
    const [mobileMenuOpened, setMobileMenuOpened] = useState<boolean>(false);
    const [form] = Form.useForm();

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
            setMenuHighlight({});
            fetchCourses(filter);
        } else {
            setMenuHighlight({ [-1]: true });
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
                        <span style={{ fontFamily: 'Impact', fontStyle: 'italic', fontSize: '13px', marginBottom: '-30px', marginRight: '48px', opacity: 0.9, color: '#B8860B' }}>IT nhà quê</span>
                    </div>
                    <ul
                        className='home-header-menu home-header-menu-responsive'
                    >
                        {
                            categories.length > 0 && categories.map((c) => {
                                return (
                                    <li
                                        key={c.id}
                                        onClick={() => {
                                            if (c.value == 'all') {
                                                fetchCourses();
                                                form.resetFields();
                                            } else {
                                                fetchCourses(`filter=category.value='${c.value}'`)
                                                form.resetFields();
                                            }
                                            setMenuHighlight({ [c.id]: true });
                                        }}
                                    >
                                        <span className={`${menuHighlight[c.id] ? 'current-home-menu-item' : ''}`}>{c.name}</span>
                                    </li>
                                );
                            })
                        }
                    </ul>

                </div>
                <div
                    className='mobile-menu-container-responsive'
                    style={{ fontSize: '28px', cursor: 'pointer', display: 'none', marginRight: '5px' }}
                    onClick={() => setMobileMenuOpened((prev) => {
                        const newState = !prev;
                        return newState;
                    })}
                >
                    {!mobileMenuOpened && <MenuOutlined className='mobile-menu-icon' />}
                    {mobileMenuOpened && <CloseOutlined className='mobile-close-icon' />}

                </div>

                {
                    mobileMenuOpened &&
                    <ul
                        style={{
                            // display: mobileMenuOpened ? 'block' : 'none',
                            // visibility: mobileMenuOpened ? 'visible' : 'hidden',
                            position: 'fixed', left: 0, margin: 0, padding: 0, listStyle: 'none',
                            top: '60px', width: '100%', boxSizing: 'border-box', zIndex: '10',
                        }}
                        className='mobile-menu-item-container'
                    >
                        {
                            categories.length > 0 && categories.map((ct, ind) => {
                                return (
                                    <li
                                        className={`${ind === 0 ? 'top-mobile-menu-item' : ''} ${menuHighlight[ct.id] ? 'current-mobile-menu-item' : ''}`}
                                        key={ct.id}
                                        onClick={() => {
                                            if (ct.value == 'all') {
                                                fetchCourses();
                                                form.resetFields();
                                            } else {
                                                fetchCourses(`filter=category.value='${ct.value}'`)
                                                form.resetFields();
                                            }
                                            setMenuHighlight({ [ct.id]: true });
                                            setMobileMenuOpened(false)
                                        }}
                                    >
                                        {ct.name}
                                    </li>
                                );
                            })
                        }
                    </ul>
                }


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
                                        className='homecard-responsive client-course-card'
                                    >
                                        <Card
                                            style={{ width: '100%', cursor: 'pointer' }}
                                            cover={
                                                <div
                                                    style={{
                                                        width: '100%',
                                                        minHeight: '120px',
                                                        aspectRatio: '100 / 57',
                                                        backgroundImage: `url(${import.meta.env.VITE_BACKEND_URL}/storage/course/${course.image})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        backgroundRepeat: 'no-repeat',
                                                        borderRadius: '2px 2px 1px 1px'
                                                    }}
                                                />
                                            }
                                            onClick={() => window.location.href = `/khoa-hoc/${toSlug(course.title)}/bai-hoc/${course.firstLessonId}`}
                                        >
                                            <div
                                                style={{
                                                    display: 'block',
                                                    marginTop: '-10px',
                                                    marginLeft: '-14px',
                                                    marginRight: '-16px',
                                                }}
                                            >
                                                <div className='client-course-title-container'>
                                                    <span style={{ background: '#ffbd1b', padding: '3px 5px', marginRight: '5px', fontSize: '15px', borderRadius: '2px' }}>{course.skill}</span>
                                                    <span className='client-course-title'>{course.title}</span>
                                                </div>

                                                <div className='client-course-detail'>
                                                    <RightArrow />
                                                    <span style={{ fontSize: '15px' }}>Xem chi tiết</span>
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
        </div >
    );
}

export default HomePage;