import React,{useEffect} from 'react'
import axios from 'axios'
import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: "0 auto",
            marginTop: "20px",
          width: "50%",
        },
        textAlign:"center"
      },
      paddingPaper:{
        padding:"20px"
    }
})
)

export default function Paragraphs(){
    const [paragraphs,setParagraphs] = React.useState([])
    const classes = useStyles()

    useEffect(()=>{
        axios.post('http://localhost:5000/getparagraphs')
        .then(function (response){
          setParagraphs(response.data)
        })
    },[])

    return(
        <div>
        {paragraphs.map((v,i)=>{
            return(
            <div className={classes.paper} key={i}>
            <Paper elevation={3} className={classes.paddingPaper}>
<Typography variant="h6">{v.title}</Typography>
<p>{v.paragraph}</p>
            </Paper>
        </div>
        )}
        )
    }
        </div>
    )
}