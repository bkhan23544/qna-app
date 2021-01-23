const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
var fs = require('fs')
var keyword_extractor = require("keyword-extractor");

const app = express()
app.use(cors(),bodyParser.json())



app.post('/getparagraphs',function (req,res){
  var paragraphs = require('./paragraphs.json')
  var paragraphsToSend = []
  for(var i=0;i<paragraphs.length;i++){
    var temp={}
    temp.paragraph=paragraphs[i].paragraph
    temp.title=paragraphs[i].title
    paragraphsToSend.push(temp)
  }
  paragraphsToSend = paragraphsToSend.reverse()
  res.send(paragraphsToSend)
})

app.post('/getquestions',function (req,res){
  var questions = require('./questions.json')
  res.send(questions)
})

app.post('/addvariant',function (req,res){
  fs.readFile('questions.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data);
    var stringObj = []
    for(var i=0;i<obj.length;i++){
      stringObj.push(JSON.stringify(obj[i]))
    }
    var index = stringObj.indexOf(JSON.stringify(req.body.question))
    obj[index].question.push(req.body.variant)
    json = JSON.stringify(obj,null,2); //convert it back to json
    fs.writeFileSync('questions.json', json); // write it back 
    
}});
res.send("success")
})

app.post('/savequestion', function (req,res){
  fs.readFile('questions.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    obj.push(req.body); //add some data
    json = JSON.stringify(obj,null,2); //convert it back to json
    fs.writeFileSync('questions.json', json); // write it back 
}});
res.send(req.body)
})

app.post('/checkquestion',function (req,res){
  var question = req.body.question.toLowerCase()
  const allQuestions = require('./questions.json')
  const sentenceMatchingPercent = require('./config.json')
  var questions=[]
  var percentages=[]
  allQuestions.map((v,i)=>{
    questions.push(v.question)
    })   

  

  for(var i=0;i<questions.length;i++){
    percentages.push([])
    for(var j=0;j<questions[i].length;j++){
    var percentage = SimilarityPercentage(questions[i][j].split(" "), question.split(" "));
    console.log(percentage,"percentage of q")
    percentages[i].push(percentage)
    console.log(percentages,"percentage of all")
  }
  }
  var maxInVariants=[]

  for(var i=0;i<percentages.length;i++){
    var max = Math.max(...percentages[i])
    maxInVariants.push(max)
    console.log(maxInVariants,"maxInVariants")
  }
  var max = maxInVariants.indexOf(Math.max(...maxInVariants));
  if(Math.max(...maxInVariants)>sentenceMatchingPercent.sentenceMatchingPercent){
    res.send({answer:allQuestions[max].answer})
  }
  else{
    res.send("not found")
  }

  // res.send("not found")
  
})

app.post('/submitparagraph', function (req, res) {
    var extraction_result = keyword_extractor.extract(req.body.paragraph,{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: true

   });
   var paragraphData = req.body
   paragraphData.keywords = extraction_result


    fs.readFile('paragraphs.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.push(paragraphData); //add some data
        json = JSON.stringify(obj,null,2); //convert it back to json
        fs.writeFileSync('paragraphs.json', json); // write it back 
    }});
    res.send(paragraphData)
  })



  app.post('/askquestion',function (req,res){
      var question = req.body.question
      var extraction_result = keyword_extractor.extract(question,{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: true

   });

   const paragraphs = require('./paragraphs.json')
   var keywords=[]
paragraphs.map((v,i)=>{
keywords.push(v.keywords)
})   
var percentages=[]
   let arrayB=extraction_result
   for(var i=0;i<keywords.length;i++){
    var percentage = SimilarityPercentage(keywords[i],arrayB)
    percentages.push(percentage)
    // console.log("percentage "+i+":"+percentage)
   }

   var max = percentages.indexOf(Math.max(...percentages));
  
   res.send({paragraph:paragraphs[max].paragraph})
  })
   
  app.listen(5000, () => {
    console.log("Serving on 5000");
   
})

function SimilarityPercentage(arrayA,arrayB){
  let answer =arrayA.filter(function(item) {
     return arrayB.indexOf(item) >= 0;
  }).length
  return answer/(Math.max(arrayA.length,arrayB.length))*100
}