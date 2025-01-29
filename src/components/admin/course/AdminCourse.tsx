import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Switch, Button, Popover, notification } from 'antd';
import AddCourseModal from './AddCourseModal';
import { useEffect, useState } from 'react';
import { callDeleteCourse, callFetchCourses, callUpdateCourseActive } from '@/config/api';
import { ICourseCard, IUpdateCourseActive } from '@/types/backend';
import UpdateCourseModal from './UpdateCourseModal';

const AdminCourse = () => {
    const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
    const [updateCourseModalOpen, setUpdateCourseModalOpen] = useState(false);
    const [updateCourseId, setUpdateCourseId] = useState(-1);
    const [courses, setCourses] = useState<ICourseCard[]>([]);
    const [coursesActive, setCoursesActive] = useState<{ [key: number]: boolean }>({});
    const [openPopver, setOpenPopver] = useState<{ [key: number]: boolean }>({});
    const switchOnChange = async (checked: boolean, cId: number, cTitle: string) => {
        const actCourse: IUpdateCourseActive = {
            id: cId,
            title: cTitle,
            active: checked
        }
        const res = await callUpdateCourseActive(actCourse);
        if (res.statusCode === 200) {
            setCoursesActive((prev) => {
                return {
                    ...prev,
                    [cId]: checked
                }
            })
        }
    };

    const fetchCourses = async () => {
        const res = await callFetchCourses(`page=1&size=20&sort=createdAt,desc`);
        if (res && res.data) {
            const coursesDB = res.data.result;
            setCourses(coursesDB);

            const coursesActiveDB: { [key: number]: boolean } = {}
            coursesDB.forEach((item: ICourseCard) => {
                coursesActiveDB[item.id] = item.active;
            });
            setCoursesActive(coursesActiveDB);
        }
    }

    const handleDelete = async (id: number) => {
        const res = await callDeleteCourse(id);
        if (res.statusCode === 200) {
            fetchCourses();
            notification.success({
                message: 'Delete successfully'
            })

        } else if (res.statusCode === 500) {
            notification.error({
                message: 'Unable to delete this course due to 500 error.'
            })
        }
    }

    useEffect(() => {
        fetchCourses();
    }, [])

    return (
        <div className="admin-course">
            <div className='header'>
                <div>Course Manage</div>
                <Button
                    style={{ borderRadius: '3px', marginRight: '5px' }}
                    onClick={() => setAddCourseModalOpen(true)}
                >
                    <PlusOutlined />
                    Add Course
                </Button>

            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', marginLeft: '-8px', marginRight: '-8px', rowGap: '24px' }}>
                {courses.map((course) => (
                    <div
                        key={course.id}
                        style={{ width: '25%', flexWrap: 'wrap', paddingLeft: '8px', paddingRight: '8px' }}
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
                                    }}

                                />
                            }
                            onClick={() => window.location.href = `/admin-course-manage/lesson/${course.firstLessonId}`}
                        >
                            <div
                                style={{
                                    marginTop: '-10px',
                                    marginLeft: '-12px',
                                    marginRight: '-12px',
                                    marginBottom: '28px',
                                    height: '130px',
                                }}
                            >
                                <div className='course-title'>
                                    {course.title}
                                </div>
                                <div className='course-discripttion'>
                                    {`- ${course.category}`}
                                </div>
                                <div className='course-discripttion'>
                                    {`- ${course.skill}`}
                                </div>
                            </div>
                            <Switch
                                checked={coursesActive[course.id]}
                                onChange={(value, event) => {
                                    event.stopPropagation();
                                    switchOnChange(value, course.id, course.title)
                                }}
                                style={{ position: 'absolute', left: '12px', width: '48px', bottom: '12px', borderRadius: '15px' }}
                            />
                            <Button
                                className='course-edit'
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setUpdateCourseModalOpen(true);
                                    setUpdateCourseId(course.id);
                                }}
                            >
                                EDIT
                            </Button>
                            <Popover
                                open={openPopver[course.id]}
                                placement="leftBottom"
                                content={
                                    <div
                                        className='course-delete-popover'
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ display: 'flex', justifyContent: 'left', gap: '15px', marginTop: '15px', paddingBottom: '8px' }}
                                    >
                                        <button
                                            style={{ padding: '2px 10px', cursor: 'pointer', minWidth: '50px' }}
                                            onClick={(e) => {
                                                handleDelete(course.id);
                                                e.stopPropagation();
                                                setOpenPopver({});
                                            }}
                                        >
                                            Yes
                                        </button>
                                        <button style={{ padding: '2px 10px', cursor: 'pointer', minWidth: '50px' }}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setOpenPopver({});
                                            }}
                                        >
                                            No
                                        </button>
                                    </div>
                                }
                                title="Do you want to delete?"
                                trigger="click"
                            >
                                <DeleteOutlined className={`course-delete ${openPopver[course.id] ? 'course-delete-popover-opened' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenPopver({ [course.id]: true });
                                    }}
                                />
                            </Popover>

                        </Card>
                    </div>
                ))}
            </div>
            {addCourseModalOpen && <AddCourseModal isModalOpen={addCourseModalOpen} setIsModalOpen={setAddCourseModalOpen} />}
            {updateCourseModalOpen && <UpdateCourseModal courseId={updateCourseId} isModalOpen={updateCourseModalOpen} setIsModalOpen={setUpdateCourseModalOpen} />}
        </div >
    );
}

export default AdminCourse;