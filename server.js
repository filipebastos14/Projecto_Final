const express = require('express');
const mysql = require('mysql');
const expressLayouts = require('express-ejs-layouts')
const userPath = './models/user.json'

const ejs = require('ejs');
const path = require('path');
const port = 3000;

const app = express();

app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended : false }))
app.use(express.static('public'));
app.use(expressLayouts)
app.set('layout', 'layout/main')

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "pfteste",
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

// Conexão DB
const DbConnect = require('./db/db');
const db = DbConnect.getDbConnectInstance();

const userModel = require('./controllers/userController');
const { TextEncoderStream } = require('node:stream/web');
const userModelFunctions = userModel.getUserInstance();

const dateModel = require('./controllers/dateController');
const { error } = require('console');
const dateModelFunctions = dateModel.getDateModelInstance()

app.get('/login', (req,res) => {
    const user = require(userPath);
    if (user["email"] == null) {
        res.render('login/login', {layout: 'layout/visitor'})
    } else {
        res.render('user_account/index', user);
    } 
})


app.get('/register', (req,res) => {
    const user = require(userPath);
    if (user["email"] == null) {
        res.render('login/newUser', {layout: 'layout/visitor'})
    } else {
        res.render('user_account/index', user);
    }
})


app.get('/reset', (req,res) => {
    const user = require(userPath);
    if (user["email"] == null) {
        res.render('login/recoverPassword',{layout: 'layout/visitor'})
    } else {
        res.render('user_account/index', user);
    }
})


// Homepage
app.get('/', (req, res) => {
    const user = require(userPath);
    if (user["email"] == null) {
        res.redirect('/login')
    } else {
        res.render('user_account/index', user);
    } 
})


app.get('/1', (req,res) => {
    const user = require(userPath);
    if (user["email"] == null) {
        res.redirect('/login')
    } else {
        res.render('user_account/accountsDetails')
    }
})


app.get('/2', (req,res) => {
    const user = require(userPath);
    if (user["email"] == null) {
        res.redirect('/login')
    } else {
        res.render('user_account/categories')
    } 
})


app.get('/movimentos', (req,res) => {
    const user = require(userPath);
    if (user["email"] == null) {
        res.redirect('/login')
    } else {
        userModelFunctions.ordenarMovimentos(user)
        userAtualizado = require('./models/user.json');
        res.render('user_account/movements',userAtualizado)
    } 
    
})


app.post('/user/new', async (req,res) => {
    console.log("3");
    try {
        let object = req.body;
        const result = await db.registarUtilizador(object)

        res.redirect('/login')
        //.catch(console.log(err));
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
})


app.get('/user/login/', (req,res) => {
    console.log('1');
    const email = req.query.email;
    const pass = req.query.pass;
    console.log(email,pass);
    let query = "select id,nome,email,pass from utilizador where email = ?"
 
        con.query(query,email,(err,result) => {
            console.log(result);
            if (err) {
                console.log(err.message);
                res.status(500).send("Internal Server Error");
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    console.log("2");
    
                    // compara email e pass com resultados da query
                    if (user.email === email && user.pass == pass) {
                        // se corresponder
                        console.log('autenticado');
                        let userDetalhes = {
                            'id': user.id,
                            'email': user.email,
                            'nome': user.nome,
                            'pass': user.pass,
                            'saldoAtual': 0,
                            'saldoPrevisto': 0,
                            'movimentos': []
                        }

                        console.log(userDetalhes);
                        let query = "select c.categoria as cat, m.valor as val, m.data_movimento as data, m.descricao as descr, m.tipo_movimento as tipo, m.id as id from movimento m join categoria c on m.id_categoria = c.id where id_utilizador = ?"
                        con.query(query,userDetalhes.id, (err,result2) => {
                            if (result2.length > 0) {
                                result2.forEach(resultado => {
                                    let dataFormatada = dateModelFunctions.converterFormato(resultado.data)
                                    let userMovimento = {
                                        'id': resultado.id,
                                        'categoria': resultado.cat,
                                        'valor': resultado.val,
                                        'data' : dataFormatada,
                                        'descricao' : resultado.descr,
                                        'tipo' : resultado.tipo
                                    }
                                    let atual = dateModelFunctions.hojeOuAntes(dataFormatada)
                                    if (resultado.tipo == 2) {
                                        userDetalhes.saldoPrevisto+=resultado.val
                                        atual = dateModelFunctions.hojeOuAntes(dataFormatada)
                                        if (atual) {
                                            userDetalhes.saldoAtual+=resultado.val
                                        }
                                    } else {
                                        userDetalhes.saldoPrevisto-=resultado.val
                                        if (atual) {
                                            userDetalhes.saldoAtual-=resultado.val
                                        }
                                    }
                                    userDetalhes.movimentos.push(userMovimento)
                                });
                            }
                            console.log(result2);
                            userModelFunctions.guardarUser(JSON.stringify(userDetalhes,null,2))
                            userModelFunctions.ordenarMovimentos(userDetalhes)
                            userOrdenado = require(userPath)
                            res.render('user_account/index', userOrdenado)
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


app.post('/mov/new', async (req, res) => {
    try {
        let object = req.body;
        console.log("objeto:  " + [object]);

        const result = await db.novoMovimento(object);

        idMov = result.insertId

        console.log("id: " + idMov);

        let movimento = {
            "id": idMov,
            "categoria": (parseInt(object['categoria'])-1),
            "valor": (parseInt(object['valor'])),
            "data": object['data'],
            "descricao": object['descricao'],
            "tipo": parseInt(object['tipo'])
        }

        console.log("movimento: " + movimento);

        userModelFunctions.adicionarMovimento(movimento)

        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/user/mov',(req,res) => {
    const id = req.query.id
    const result = db.verMovimento(id)

    return result
})

app.post('/user/reset',async (req,res) => {
    try {
        object = req.body;

        const result = await db.verificarUtilizador(object['email'])

        const result2 = await db.atualizarUtilizador(object)

        res.redirect('/login')
        
    } catch (error) {
        console.log("catch1" + error);
    }
})


app.get('/logout', async (req,res) => {

    try {
        await userModelFunctions.logout()

        res.redirect('/login')
    } catch (error) {
        console.log(error);
    }
})


app.listen(port, () => {
    console.log("Connected");
})
