import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { increment, decrement, incrementByAmount } from '@/redux/slices/counterSlice'
import { Form } from 'antd';
import './Counter.scss'



const Counter = () => {
    const dispatch = useAppDispatch();
    const count = useAppSelector(st => st.counter.count)
    console.log("check count: ", count);
    const [amount, setAmount] = useState(0);

    return (
        <div>
            <h2>Count: {count}</h2>
            <div className='redux-counting'>
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"

                >
                    <Form.Item>
                        <button onClick={() => dispatch(increment())}>Increment</button>
                    </Form.Item>
                    <Form.Item>
                        <button onClick={() => dispatch(decrement())}>Decrement</button>
                    </Form.Item>
                    <Form.Item>
                        <button onClick={() => dispatch(incrementByAmount(amount))}>
                            Increment by Amount
                        </button>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))} // Cập nhật số lượng
                            placeholder="Enter amount"
                            style={{ marginLeft: "20px" }}
                        />
                    </Form.Item>
                </Form>

            </div>

        </div>
    );


}


export default Counter;