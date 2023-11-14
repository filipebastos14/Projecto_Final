const mysql = require('mysql');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
let instance = null;

const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "route",
    database: "projecto_final",
    port: "3306"
})

con.connect((err) => {
    if (err) {
        console.log(err.message)
    }
    console.log("DB: " + con.state);
})



// function verificarDuplicado(email) {
//     app.get('',(req,res) => {
//         let query = 'select email where email = ?'
//         con.query(query,email,(err,result) => {
//             if(results.length > 0) {
//                 return true;
//             }
//             return false;
//         })
//     })
// }

class DbConnect {
    // Singleton para conexão à bd
    static getDbConnectInstance() {
        return instance ? instance : new DbConnect();
    }

    async registarUtilizador(object) {
        try {
            let result = await new Promise((resolve, reject) => {
                let query = "insert into utilizador(nome,email,pass) values (?)"
                let convertedObject = [[object.nome,object.email,object.pass]]

                con.query(query,convertedObject,(err,result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result);
                    }
                })
            })

            return result

        } catch (error) {
            console.log(error);
        }
    }


    async novoMovimento(object) {
        try {
            let result = await new Promise((resolve, reject) => {
            
                let query = 'insert into movimento (id_utilizador,id_categoria,valor,data_movimento,descricao,tipo_movimento) values (?)'
                con.query(query,[[object.user,object.categoria,object.valor,object.data,object.descricao,object.tipo]],(err,result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        console.log([result.id]);
                    }
                })
            })

            return result

        } catch (error) {
            console.log(error);
        }
    }

    async verMovimento(id) {
        try {
            let result = await new Promise((resolve, reject) => {
            
                let query = 'select * from movimento where id_utilizador = ?'
                con.query(query,parseInt(id),(err,result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        console.log([result]);
                    }
                })
            })

            return result

        } catch (error) {
            console.log(error);
        }
    }
} 

module.exports = DbConnect;