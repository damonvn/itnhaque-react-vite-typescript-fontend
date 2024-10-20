import { useEffect, useState } from 'react'
import '@/App.css'
import { callGetHome } from './types/api'
import Counter from '@/component/Test_Redux/Counter';

const App = () => {

  const [homeString, setHomeString] = useState('NO DATA');

  useEffect(() => {
    const getHomeString = async () => {
      const res = (await callGetHome()).data;
      if (res) {
        console.log("Check home res: ", res);
        //@ts-ignore
        setHomeString(res)
      }
    }
    getHomeString();
  }, [])
  return (
    <div >
      <div style={{ textAlign: "center", marginTop: "10px" }}>{`DATA from backend: ${homeString}`}</div>
      <div style={{ paddingLeft: "100px", justifyContent: "center", width: "100vw" }}>
        <div style={{ width: "100vw" }}><Counter /></div>
      </div>
    </div>
  )
}

export default App
