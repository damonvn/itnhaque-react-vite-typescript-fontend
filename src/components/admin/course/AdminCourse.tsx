import { PlusOutlined } from '@ant-design/icons';
import { Card, Switch, Button } from 'antd';
import AddCourseModal from './AddCourseModal';
import { useEffect, useState } from 'react';
import { callFetchCourses, callUpdateCourseActive } from '@/config/api';
import { ICourseCard, IUpdateCourseActive } from '@/types/backend';
import UpdateCourseModal from './UpdateCourseModal';



const AdminCourse = () => {
    const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
    const [updateCourseModalOpen, setUpdateCourseModalOpen] = useState(false);
    const [updateCourseId, setUpdateCourseId] = useState(-1);
    const [courses, setCourses] = useState<ICourseCard[]>([]);
    const [coursesActive, setCoursesActive] = useState<{ [key: number]: boolean }>({});
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
                                <img
                                    style={{ width: '100%' }}
                                    alt="example"
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/course/${course.image}`}
                                />
                            }
                            onClick={() => window.location.href = `/admin-course-manage/lesson/${course.id}`}
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
                            <Switch
                                checked={coursesActive[course.id]}
                                onChange={(value, event) => {
                                    event.stopPropagation();
                                    switchOnChange(value, course.id, course.title)
                                }}
                                style={{ position: 'absolute', left: '75px', bottom: '12px', borderRadius: '15px' }}
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
                        </Card>
                    </div>
                ))}


            </div>
            {addCourseModalOpen && <AddCourseModal isModalOpen={addCourseModalOpen} setIsModalOpen={setAddCourseModalOpen} />}
            {updateCourseModalOpen && <UpdateCourseModal courseId={updateCourseId} isModalOpen={updateCourseModalOpen} setIsModalOpen={setUpdateCourseModalOpen} />}

        </div>
    );
}

export default AdminCourse;