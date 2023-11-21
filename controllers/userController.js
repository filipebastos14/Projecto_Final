const DbConnect = require("../db/db");
const db = DbConnect.getDbConnectInstance();

const dateModel = require('../controllers/dateController');
const dateModelFunctions = dateModel.getDateModelInstance()

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
                    if (resultado.tipo == 1) {
                      userDetalhes.saldoPrevisto-=resultado.val
                      if (atual) {
                        userDetalhes.saldoAtual-=resultado.val
                      }
                    } else {
                      userDetalhes.saldoPrevisto+=resultado.val
                      if (atual) {
                        userDetalhes.saldoAtual+=resultado.val
                      }
                    }
                    userDetalhes.movimentos.push(userMovimento)
                });
            
                resolve(userDetalhes) 
              } catch (error) {
                console.log(error);
                console.log("Erro ao gerar user");
              }
        })
    }
}

module.exports = userModel


