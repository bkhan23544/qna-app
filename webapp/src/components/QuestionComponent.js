import React from 'react'
import { Paper, Typography,Button,TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import { useAlert } from 'react-alert'

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: "0 auto",
            marginTop: "20px",
          width: "50%",
        },
      },
      paddingPaper:{
        padding:"20px"
    }
})
)

export default function QuestionComponent(props){


const [version,setVersion] = React.useState(false)    
const [state,setState] = React.useState({})
const classes = useStyles()
const alert = useAlert()


const handleChange=(e)=>{
    setState({...state,[e.target.name]:e.target.value})
    }

const handleSubmit=()=>{
    if(state.question){
        axios.post('http://localhost:5000/addvariant',{
            variant:state.question.toLowerCase(),
            question:props.v
        })
    .then(function (response){
        setVersion(false)
        setTimeout(() => {
            props.getQuestions()
        }, 100);
       
        console.log(response.data)
    })
}
else{
    alert.show("Please Add a Variant",{
        closeCopy:"OK"
      })
}
}

    return(
        <div className={classes.paper}>
        <Paper elevation={3} className={classes.paddingPaper}>

<ul>
{props.v.question.map((q,j)=>{
return(
    <li key={j}><b>{q}</b></li>
)
})}
</ul>
<div style={{paddingLeft:"20px"}}>
<Typography variant="h6">Answer: {props.v.answer}</Typography>

{version ? 
<div style={{marginTop:"20px"}}>
    <TextField fullWidth id="outlined-basic" label="Enter Variant" variant="outlined" name="question" onChange={handleChange}/><br/>
    <Button fullWidth style={{marginTop:"10px"}} variant="contained" color="primary" onClick={()=>handleSubmit()}>Add Variant</Button>
</div>
:<Button fullWidth style={{marginTop:"10px"}} variant="contained" color="primary" onClick={()=>setVersion(true)}>Add Variant</Button>}
</div>

        </Paper>
    </div>
    )
}