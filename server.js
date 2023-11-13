const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')

const ejs = require('ejs');
const path = require('path');
const port = 3000;

const app = express();

app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended : false }))
app.use(express.static('public'));

const DbConnect = require('./db/db');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testepf",
    port: "3306"
})

con.connect((err) => {
    if (err) {
        console.log(err.message)
    }
    console.log("DB: " + con.state);
})

// Configuração do ejs
app.set('view engine', 'ejs');  
app.set('views', path.join('views/'));

app.get('/', (req,res) => {
    res.render('index')
})

// Teste render
// app.get('/id/:id', (req, res) => {
//     const {id} = req.params;
//     const dataId = dataTeste[id];
//     res.render('home', dataId);
// })

// Conexão DB
const db = DbConnect.getDbConnectInstance();

app.post('/user/new', (req,res) => {
    let object = req.body;
    const result = db.registarUtilizador(object)

    result.then(console.log("User inserido com o id: " + result.insertId))
    //.catch(console.log(err));
})


app.get('/user/login/', (req,res) => {
    const email = req.query.email;
    const pass = req.query.pass;
    let query = "select id,nome,email,pass from utilizador where email = ?"
 
        con.query(query,email,(err,result) => {
            if (err) {
                console.log(err.message);
                res.status(500).send("Internal Server Error");
            } else {
                if (result.length > 0) {
                    const user = result[0];
    
                    // compara email e pass com resultados da query
                    if (user.email === email && user.pass == pass) {
                        // se corresponder
                        console.log('autenticado');
                        let userDetalhes = {
                            'id': user.id,
                            'email': user.email,
                            'nome': user.nome,
                            'pass': user.pass,
                            'saldo': 0,
                            'movimentos': []
                        }
                        console.log(userDetalhes);
                        let query = "select c.categoria as cat, m.valor as val, m.data_movimento as data, m.descricao as descr, m.tipo_movimento as tipo from movimento m join categoria c on m.id_categoria = c.id where id_utilizador = ?"
                        con.query(query,userDetalhes.id, (err,result2) => {
                            if (result2.length > 0) {
                                result2.forEach(resultado => {
                                    let userMovimento = {
                                        'categoria': resultado.cat,
                                        'valor': resultado.val,
                                        'data' : resultado.data,
                                        'descricao' : resultado.descr,
                                        'tipo' : resultado.tipo
                                    }
                                    if (resultado.tipo == 2) {
                                        userDetalhes.saldo+=resultado.val
                                    } else {
                                        userDetalhes.saldo-=resultado.val
                                    }
                                    userDetalhes.movimentos.push(userMovimento)
                                });
                            }
                            console.log(result2);
                            console.log(userDetalhes);
                            res.render('home', userDetalhes)
                        })
                    } else {
                        // se dados não corresponderem
                        res.status(401).send("Email ou pass incorreto");
                    }
                } else {
                    res.status(404).send("Utilizador não encontrado");
                }
            }
        })
})

app.post('/mov/new', (req,res) => {
    let object = req.body;
    const result = db.novoMovimento(object)
})

app.get('/user/mov',(req,res) => {
    const id = req.query.id
    const result = db.verMovimento(id)

    return result
})

app.listen(port, () => {
    console.log("Connected");
})
