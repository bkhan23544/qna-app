import React,{useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { Button, Typography } from '@material-ui/core';
import axios from 'axios'
import { useAlert } from 'react-alert'

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
      paddingPaper:{
          padding: "20px"
      }
  }));

export default function SubmitParagraph(){

const [state,setState] = React.useState({}) 
const classes = useStyles()
const alert = useAlert()

const handleChange=(e)=>{
setState({...state,[e.target.name]:e.target.value})
}



const handleSubmit=()=>{
  if(state.paragraph && state.title){
    axios.post('http://localhost:5000/submitparagraph',{
        paragraph:state.paragraph,
        title:state.title
    })
    .then(function (response) {
      // handle success
      alert.show("Submission Successful")
      setState({...state,paragraph:"",title:""})
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
    alert.show("Please Fill All Fields.",{
      closeCopy:"OK"
    })
  }
}

    return(
        <div className={classes.paper}>
            <Paper elevation={3} className={classes.paddingPaper}>
                <Typography variant="h4">Submit Paragraph</Typography>
                   <div className={classes.input}>
      <TextField value={state.title} id="outlined-basic" label="Title" variant="outlined" name="title" onChange={handleChange}/>
    </div>
    <div className={classes.input}>
    <TextField value={state.paragraph} rows={15} multiline={true} id="outlined-basic" label="Paragraph" name="paragraph" variant="outlined" onChange={handleChange}/>
    </div>
    <Button style={{marginTop:"10px"}} fullWidth variant="contained" onClick={handleSubmit} color="primary">Submit</Button>
    </Paper>
        </div>
    )
}

