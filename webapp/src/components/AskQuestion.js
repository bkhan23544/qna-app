import React,{useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { Button, Typography } from '@material-ui/core';
import axios from 'axios'
import { useAlert } from 'react-alert'
import * as qna from '@tensorflow-models/qna';
import * as tf from '@tensorflow/tfjs-core'
import CircularProgress from '@material-ui/core/CircularProgress';


var model;

const useStyles = makeStyles((theme) => ({
    input: {
      '& > *': {
        marginTop: theme.spacing(4),
        width: '100%',
      },
    },
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: "0 auto",
            marginTop: "10%",
          width: "30%",
          height: "30%",
        },
        textAlign:"center"
      },
      loader:{
        margin: "0 auto",
        marginTop: "10%",
        textAlign:"center"
      },
      loader2:{
        margin: "0 auto",
        textAlign:"center",
        marginTop: "10px",
      },
      paper1: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: "0 auto",
            marginTop: "20px",
          width: "30%",
          height: "30%",
        },
        textAlign:"center"
      },
      paddingPaper:{
          padding:"20px"
      }
  }));


export default function AskQuestion(props){

    const [state,setState] = React.useState({}) 
    // const [loading,setLoading] = React.useState(true)
    const [answer,setAnswer] = React.useState("")
    const [satisfied,setSatisfied] = React.useState(false)
    const [answerLoading,setAnswerLoading] = React.useState(false)
    const classes = useStyles()
    const alert = useAlert()

    // useEffect(()=>{
    //   tf.setBackend('webgl')
    //   qna.load().then(models => {
    //     setLoading(false)
    // model=models
    //   })
    // },[])
    
    const getAnswers=(paragraph,question)=>{
      props.model.findAnswers(question, paragraph).then(answers => {
        if(answers.length==0){
          setSatisfied(false)
          setAnswer("No Answer")
          setAnswerLoading(false)
        }
        else{
          setSatisfied(true)
          setAnswer(answers[0].text)
          setAnswerLoading(false)
        }
       
      });
    }

    const handleSatisfied=()=>{
      axios.post('http://localhost:5000/savequestion',{
        question:[state.question.toLowerCase()],
        answer:answer
      })
      .then(function (response){
        setState({...state,question:""})
      })
      setSatisfied(false)
    }

    const handleChange=(e)=>{
        setState({...state,[e.target.name]:e.target.value})
        setAnswer("")
        }

    const handleSubmit=()=>{
      setAnswerLoading(true)
      axios.post('http://localhost:5000/checkquestion',{
        question:state.question
    })
    .then(function (response){
      if(response.data.answer){
        setAnswer(response.data.answer)
        setAnswerLoading(false)
      }
      else{
        askQuestion()
      }
    })
    }

    const askQuestion=()=>{
        if(state.question){
            axios.post('http://localhost:5000/askquestion',{
                question:state.question
            })
            .then(function (response) {
              // handle success
              var question = state.question
              var paragraph = response.data.paragraph
              getAnswers(paragraph,question)  
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .then(function () {
              // always executed
            });
          }
          else{
            alert.show("Please Enter a Question",{
              closeCopy:"OK"
            })
          }
    }

    return(
      <div>
        {props.loading ? <div className={classes.loader}>
          <CircularProgress/>
          <Typography variant="h4">Loading Model..</Typography>
          </div> :
        <div>
        <div className={classes.paper}>
             <Paper elevation={3} className={classes.paddingPaper}>
             <Typography variant="h4">Ask Question</Typography>
             <div className={classes.input}>
      <TextField value={state.question} id="outlined-basic" label="Enter Question" variant="outlined" name="question" onChange={handleChange}/>
      <Button style={{marginTop:"10px"}} fullWidth variant="contained" onClick={handleSubmit} color="primary">Submit</Button>
    </div>
             </Paper>

            
        </div>
        {answerLoading && <div className={classes.loader2}><Typography variant="h6">Predicting Answer..</Typography></div>}
        <div className={classes.paper1}>
        {answer !=="" && <Paper elevation={3}>
         {answer!=="No Answer" ? <p style={{fontSize:"20px"}}><b>Answer: </b>{answer}</p> :
         <p style={{fontSize:"20px"}}><b>No Answer</b></p>}
         {satisfied && <div>
         <p>Are You Satisfied with the answer?</p>
         <Button style={{margin:"10px"}} variant="contained" color="primary" onClick={handleSatisfied}>Yes</Button>
         <Button variant="contained" color="primary" onClick={()=>setSatisfied(false)}>No</Button>
         </div>}
         </Paper>}
         </div>
        </div>
        }
        </div>
    )
}