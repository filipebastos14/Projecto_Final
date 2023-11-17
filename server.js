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

//pagina de login
app.get('/login', (req,res) => {
    const userOutput = require(userPath);
    if (userOutput["email"] == null) {
        res.render('login/login', {layout: 'layout/visitor'})
    } else {
        res.redirect('/');
    } 
})

// pagina de registo
app.get('/register', (req,res) => {
    const userOutput = require(userPath);
    if (userOutput["email"] == null) {
        res.render('login/newUser', {layout: 'layout/visitor'})
    } else {
        res.reredirect('/');
    }
})

// pagina de recuperação
app.get('/reset', (req,res) => {
    const userOutput = require(userPath);
    if (userOutput["email"] == null) {
        res.render('login/recoverPassword',{layout: 'layout/visitor'})
    } else {
        res.redirect('user_account/index');
    }
})


// Homepage
app.get('/', (req, res) => {
    const userOutput = require(userPath);
    if (userOutput["email"] == null) {
        res.redirect('/login')
    } else {
        res.render('user_account/index', userOutput);
    } 
})

// Página detalhes da conta
app.get('/detalhes', (req,res) => {
    const userOutput = require(userPath);
    if (userOutput["email"] == null) {
        res.redirect('/login')
    } else {
        res.render('user_account/accountsDetails', userOutput)
    }
})

// Página de categorias/estatisticas
app.get('/categorias', (req,res) => {
    const userOutput = require(userPath);
    if (userOutput["email"] == null) {
        res.redirect('/login')
    } else {
        res.render('user_account/categories', userOutput)
    } 
})

// pagina de movimentos
app.get('/movimentos', (req,res) => {
    const userOutput = require(userPath);
    if (userOutput["email"] == null) {
        res.redirect('/login')
    } else {
        res.render('user_account/movements',userOutput)
    } 
    
})

app.get('/*', (req,res) => {
    const userOutput = require(userPath);
    if (userOutput["email"] == null) {
        res.redirect('/login')
    } else {
        res.render('user_account/404')
    } 
})


app.post('/user/new', async (req,res) => {
    try {
        let object = req.body;
        const result = await db.registarUtilizador(object)

        res.redirect('/login')
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
})



app.get('/user/login', async (req,res) => {
    try {
        const email = req.query.email;
        const pass = req.query.pass;

        let result = await db.verificarUtilizador(email);

        const user = result[0];

        // compara email e pass com resultados da query
        if (user.email === email && user.pass == pass) {
            // se corresponder
            console.log('autenticado');
            let userDetalhes = {
                'id': user.id,
                'email': user.email,
                'nome': user.nome,
                'saldoAtual': 0,
                'saldoPrevisto': 0,
                'movimentos': []
            }

            const result2 = await db.movimentosUtilizador(user.id)
                
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

            userOrdenado = await userModelFunctions.ordenarMovimentos(userDetalhes)
            //res.render('user_account/index', userOrdenado);
            res.redirect('/')
            
                
            
        } else {
                // se dados não corresponderem
            res.status(401).send("Email ou pass incorreto");
        }
        
    } catch (error) {
        console.log(error);
    }
    
    

})


app.post('/mov/new', async (req, res) => {
    try {
        let object = req.body;

        const result = await db.novoMovimento(object);

        idMov = result.insertId

        let movimento = {
            "id": idMov,
            "categoria": (parseInt(object['categoria'])-1),
            "valor": (parseInt(object['valor'])),
            "data": object['data'],
            "descricao": object['descricao'],
            "tipo": parseInt(object['tipo'])
        }

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
