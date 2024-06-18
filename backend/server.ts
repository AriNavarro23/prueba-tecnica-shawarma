import express from 'express';
import cors from 'cors';
//middleware para subir archivos
import multer from 'multer';
import csvToJson from 'convert-csv-to-json';  

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let userData: Array<Record<string, string>> = [];




app.use(cors()); // enable CORS

//usar la clave file en la solicitud del cuerpo
//entra en la solicitud por el path, el middleware y se guarda en la memoria
app.post('/api/files', upload.single('file'), async (req, res) => {
    //1. extract file from request
    const { file } = req
    //2. validate that we hace
    if (!file){ 
        return res.status(400).json({message:'File is rquered'})
    }
    //3. validate the mimetype
    if(file.mimetype !== 'text/csv'){
        return res.status(500).json({message:'File must be csv'})
    }

    let json: Array<Record<string, string>> = []
    try{
    //4. transform el file(buffer) to string
        const rawCsv = Buffer.from(file.buffer).toString('utf-8')
        console.log(rawCsv)
        //5. transform string csv to json
        json =csvToJson.csvStringToJson(rawCsv)
    }catch(error){
        return res.status(500).json({message:'Error parsing the file'})
    }

    //6. save the json to db ( or memory )
    userData = json
    //7. return 200 with the message and the json
    return res.status(200).json({ data:[], message: 'El archivo se cargo correctamente' });
});

//sacar el q, y buscar a traves de los datos
app.get('/api/users', (req, res) => {
    //1. extract the query param 'q' from the request
    const { q } = req.query
    //2. validate that we have the query param
    if (!q){
        return res.status(500).json({
            message: 'Query param "q" is required'
        })
    }
    //3. filter the data from the db ( or memory ) with the query param
    const search = q.toString().toLowerCase
    const filteredData = userData.filter(row =>{
        
    })
    //4. return 200 with the filtered data
return res.status(200).json({data: []});
});

app.listen( PORT, () => {
  console.log( `Server is running at hhttp://localhost:${PORT}` );
});