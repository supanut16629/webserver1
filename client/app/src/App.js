import React,{ useState ,useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text,setText] = useState("");
  const [num,setNum] = useState(0);

  function getText(){
    axios.get("http://localhost:5000/",{crossdomain: true}).then(response =>{
      setText(response.data)
    })
  }
  function getNum(){
    axios.get("http://localhost:5000/num",{crossdomain: true}).then(response =>{
      setNum(response.data.num)
    })
  }

  useEffect(()=>{
      getText()
      getNum()
  },[])
  return (
    <div>
      <h1>Hello from Frontend</h1>
      <h4>This is Text from Backend</h4>
      <p>{text}</p>
      <h4>This is Num from Backend</h4>
      <p>num from backend = {num}</p>
    </div>
  );
}

export default App;
