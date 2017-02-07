import express = require('express');
import bodyParser = require('body-parser');
import fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/index`));

let DATA = require(`${__dirname}/data/data.json`);

app.post('/api/write', (req, res, next) =>{
    let hasError = false;

    fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify(req.body), (err) => {
        if(err){
            hasError = true;
            console.log(err);
        }
    });

    if(hasError){
        res.sendStatus(500);
    }else{
        DATA = req.body;
        res.sendStatus(200);
    }
});

app.get('/api/source', (req, res) => {
    res.send(DATA);
});

app.get('/api/fetch/*', (req, res) => {
    let pathArray = getPathArray(req.url);
    let tempData = JSON.parse(JSON.stringify(DATA));

    let status = 200;
    for(let i = 0; i < pathArray.length; i++){
        if(pathArray[i].length !== 0){
            try {
                tempData = tempData[decodeURIComponent(pathArray[i])];

                if(!tempData){
                    throw `could not find what you requested: ${pathArray[i]}`;
                }
            }catch (err) {
                console.log(err);
                status = 404;
            }
        }
    };

    if(status === 404){
        res.sendStatus(status);
    }else{
        res.json(formatResponse(tempData));
    }
});

app.listen(process.env.port || process.env.PORT || 3000, () => {
  console.log('Example app listening!');
})

function getPathArray(url : string){
    let path = url.split('api/fetch/')[1];
    return path.split('/');
}

type StringOrObject = String | Object;

function formatResponse(tempData : StringOrObject){
    return {
        data : (typeof tempData === "string") ?
            tempData : Object.keys(tempData)
    };
}