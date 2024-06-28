const ex=require('express');
const app=ex();
const bodyParser = require('body-parser');
const ht=require('https');
require('dotenv').config();

app.use(bodyParser.urlencoded({extended:true}));



app.get('/',function(req,res){
    res.sendFile(__dirname + "/signup.html");
})




app.post('/',function(req,res){
    var fname=req.body.fname;
    var lname=req.body.lname;
    var email=req.body.email;
     
    var data={
        members:[
            {
                email_address:email,
                status:'subscribed',
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);
    const AUDI_id = process.env.audi_id; // Ensure this is set correctly in your environment 
    const url = `https://us22.api.mailchimp.com/3.0/lists/${AUDI_id}`;
    

    const api_key = process.env.api_key;
    const Options = {
        method: 'POST',
        auth: `tamrat:${api_key}`
    };
    
   const request= ht.request(url,Options,function(response){
            response.on('data' ,function(data){
                if (response.statusCode===200) {
                    res.sendFile(__dirname + '/seccuss.html')
                }
                else{
                    res.sendFile(__dirname + '/failure.html')
                }
            })

          
    });


    request.write(jsonData);
    request.end();

});

app.post('/failure',function(req,res){
    res.redirect('/');
})


app.listen(  process.env.PORT || 3000,function(){
    console.log('server running on port 3000');
})


