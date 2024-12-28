import { callRefreshToken } from "@/config/api";
import { useEffect } from "react";

const Test = () => {


    useEffect(() => {
        const fetRefreshToken = async () => {
            console.log('check callRefreshToken test start: ');
            const res = await callRefreshToken();
            console.log('check callRefreshToken test: ', res);
        }
        fetRefreshToken();
    }, [])


    return <div>test refresh token</div>
}

export default Test;