// const user = {
//     user : require('../models/user.json'),
//     setUser : function(data) {this.user = data}
// }

const fs = require('fs');
const path = './models/user.json';

const DbConnect = require("../db/db");
const db = DbConnect.getDbConnectInstance();

const dateModel = require('../controllers/dateController');
const dateModelFunctions = dateModel.getDateModelInstance()

// 

class userModel { 
    static getUserInstance() {
        return new userModel();
    }

    async userInfo(userId) {
        return new Promise(async (resolve, reject) => {
            try {

                let result = await db.verificarUtilizadorID(userId);
            
                const user = result[0];
                
                let userDetalhes = {
                  'id': userId,
                  'email': user.email,
                  'nome': user.nome,
                  'saldoAtual': 0,
                  'saldoPrevisto': 0,
                  'movimentos': []
                }

                console.log(userDetalhes);
            
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

                console.log(userDetalhes);
            
                resolve(userDetalhes) 
              } catch (error) {
                console.log(error);
                console.log("Erro ao gerar user");
              }
        })
    }

    adicionarMovimento(movimento) {
        let data = require('../models/user.json')
        let categorias = require('../models/categorias.json')
        let categoria = categorias['categorias']

        movimento['categoria'] = categoria[movimento['categoria']]

        data["movimentos"].push(movimento)

        let hoje = new Date()
        let ano = hoje.getFullYear(), mes = hoje.getMonth()+1, dia = hoje.getDate();
        let hojeFormatado = ano + '-' + (mes < 10 ? '0' : '') + mes + '-' + (dia < 10 ? '0' : '') + dia;

        
        if (movimento['tipo'] == 1) {
            data['saldoPrevisto'] -= movimento['valor']
            if (movimento['data'] <= hojeFormatado) {
                data['saldoAtual'] -= movimento['valor']
            }
        } else {
            data['saldoPrevisto'] += movimento['valor']
            if (movimento['data'] <= hojeFormatado) {
                data['saldoAtual'] -= movimento['valor']
            }
        }
            
        this.ordenarMovimentos(data)
    }

    async logout() {
        return new Promise((resolve, reject) => {
            try {
                fs.writeFileSync(path,'{"email": null}')
                resolve('Logged out')
            } catch (error) {
                console.log(error);
            }
        })
        
    }
}

module.exports = userModel


