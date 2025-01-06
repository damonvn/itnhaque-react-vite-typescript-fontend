import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';


interface IProps {
    callback: string;
}
const NotPermitted: React.FC<IProps> = ({ callback }) => {
    const navigate = useNavigate();
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary"
                onClick={() => navigate(`/login?callback=${callback}`)}
            >Login with authorized account</Button>}
        />
    )
};

export default NotPermitted;