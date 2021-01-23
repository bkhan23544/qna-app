import React,{useEffect} from 'react'
import axios from 'axios'
import QuestionComponent from './QuestionComponent'




export default function Paragraphs(){
    const [questions,setQuestions] = React.useState([])

    useEffect(()=>{
        getQuestions()
    },[])

    const getQuestions=()=>{
        setQuestions([])
        axios.post('http://localhost:5000/getquestions')
        .then(function (response){
            setQuestions(response.data)
        })
    }

    

    return(
        <div>
        {questions.map((v,i)=>{
            return(
          <QuestionComponent key={i} v={v} getQuestions={getQuestions}/>
        )}
        )
    }
        </div>
    )
}