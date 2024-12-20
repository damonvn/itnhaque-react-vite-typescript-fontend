import { BorderInnerOutlined, BorderTopOutlined, EditOutlined, PlusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Card, Switch, Button } from 'antd';
import Meta from 'antd/es/card/Meta';


const AdminCourse = () => {
    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };

    return (
        <div className="admin-course">
            <div className='header'>
                <div>Course Manage</div>
                <Button
                    style={{ borderRadius: '3px', marginRight: '5px' }}
                >
                    <PlusOutlined />
                    Add Course
                </Button>

            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', marginLeft: '-8px', marginRight: '-8px' }}>
                <div style={{ width: '25%', flexWrap: 'wrap', paddingLeft: '8px', paddingRight: '8px' }}>
                    <Card
                        style={{ width: '100%' }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
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
                                Đây là một ẫu rấng khung là một ẫu rấng khung rấng khung.
                            </div>
                            <div className='course-discripttion'>
                                Discription: cônghệ sử ư viện antd
                                nguyen van a, tran văn b, nguyen van c
                                linh văn tinh tran văn b, nguyen van c
                            </div>
                        </div>
                        <Switch
                            defaultChecked onChange={onChange}
                            style={{ position: 'absolute', left: '70px', bottom: '12px' }}
                        />
                        <Button style={{
                            position: 'absolute',
                            left: '12px', bottom: '12px',
                            height: '22px', width: '44px',
                            borderRadius: '100px', background: '#fece12',
                            border: '1px solid orange',
                            fontSize: '12px',
                            fontWeight: '400'
                        }}>EDIT</Button>
                        {/* <EditOutlined style={{ position: 'absolute', right: '20px', bottom: '12px', fontSize: '22px' }} /> */}
                    </Card>
                </div>
                <div style={{ width: '25%', flexWrap: 'wrap', paddingLeft: '8px', paddingRight: '8px' }}>
                    <Card
                        style={{ width: '100%' }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
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
                                Đây là một ẫu rấng khung là một ẫu rấng khung rấng khung.
                            </div>
                            <div className='course-discripttion'>
                                Discription: cônghệ sử ư viện antd
                                nguyen van a, tran văn b, nguyen van c
                                linh văn tinh tran văn b, nguyen van c
                            </div>
                        </div>
                        <Switch
                            defaultChecked onChange={onChange}
                            style={{ position: 'absolute', left: '12px', bottom: '12px' }}
                        />
                    </Card>
                </div>
                <div style={{ width: '25%', flexWrap: 'wrap', paddingLeft: '8px', paddingRight: '8px' }}>
                    <Card
                        style={{ width: '100%' }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
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
                                Đây là một ẫu rấng khung là một ẫu rấng khung rấng khung.
                            </div>
                            <div className='course-discripttion'>
                                Discription: cônghệ sử ư viện antd
                                nguyen van a, tran văn b, nguyen van c
                                linh văn tinh tran văn b, nguyen van c
                            </div>
                        </div>
                        <Switch
                            defaultChecked onChange={onChange}
                            style={{ position: 'absolute', left: '12px', bottom: '12px' }}
                        />
                    </Card>
                </div>
                <div style={{ width: '25%', flexWrap: 'wrap', paddingLeft: '8px', paddingRight: '8px' }}>
                    <Card
                        style={{ width: '100%' }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
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
                                Đây là một ẫu rấng khung là một ẫu rấng khung rấng khung.
                            </div>
                            <div className='course-discripttion'>
                                Discription: cônghệ sử ư viện antd
                                nguyen van a, tran văn b, nguyen van c
                                linh văn tinh tran văn b, nguyen van c
                            </div>
                        </div>
                        <Switch
                            defaultChecked onChange={onChange}
                            style={{ position: 'absolute', left: '12px', bottom: '12px' }}
                        />
                    </Card>
                </div>
            </div>

        </div>
    );
}

export default AdminCourse;