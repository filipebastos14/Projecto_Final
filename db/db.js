const mysql = require('mysql');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
let instance = null;

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "meter nome da db aqui",
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

    async verificarUtilizador(email) {
        try {
          return new Promise((resolve, reject) => {
            let query = 'SELECT id, nome, email, pass FROM utilizador WHERE email = ?';
      
            con.query(query, email, (err, result) => {
              if (err) {
                reject(new Error(err.message));
              } else {
                if (result.length > 0) {
                  resolve(result);
                } else {
                  reject(new Error('Utilizador não existe'));
                }
              }
            });
          });
        } catch (error) {
          return error;
        }
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


    async movimentosUtilizador(id) {
        try {
          let result = await new Promise((resolve, reject) => {
            let query =
              "SELECT c.categoria AS cat, m.valor AS val, m.data_movimento AS data, m.descricao AS descr, m.tipo_movimento AS tipo, m.id AS id FROM movimento m JOIN categoria c ON m.id_categoria = c.id WHERE id_utilizador = ?";
            con.query(query, id, (err, result) => {
              if (err) {
                reject(new Error(err.message));
              } else {
                resolve(result);
              }
            });
          });

        return result;
          
        } catch (error) {
          console.error(error);
          throw error; // Re-throw the error to handle it in the calling code
        }
    }


    async novoMovimento(object) {
        try {
            let query = 'INSERT INTO movimento (id_utilizador, id_categoria, valor, data_movimento, descricao, tipo_movimento) VALUES (?)';

            const result = await new Promise((resolve, reject) => {
                con.query(query, [[object.user, object.categoria, object.valor, object.data, object.descricao, object.tipo]], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result);
                    }
                });
            });

            return result;
        } catch (error) {
            console.error('Error:', error);
            throw new Error(error.message);
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
                        resolve(result);
                    }
                })
            })

            return result

        } catch (error) {
            console.log(error);
        }
    }

    async atualizarUtilizador(object) {
        try {
            let result = await new Promise((resolve, reject) => {

                let query = "update utilizador set pass = ? where email = ?"
                let convertedObject = [[object.email,object.pass]]

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
            console.log("catch 3: "+error);
        }
    }
} 

module.exports = DbConnect;