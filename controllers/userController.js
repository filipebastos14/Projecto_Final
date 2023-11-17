// const user = {
//     user : require('../models/user.json'),
//     setUser : function(data) {this.user = data}
// }

const fs = require('fs');
const path = './models/user.json';

// 

class userModel { 
    static getUserInstance() {
        return new userModel();
    }

    async guardarUser(data) {
        return new Promise((resolve, reject) => {
            try {
                const dir = path.substring(0, path.lastIndexOf('/'));
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
        
                fs.writeFileSync(path, data);
                resolve(`Data saved to ${path}`)
            } catch (error) {
                console.error(error);
            }
        })
    }

    async ordenarMovimentos(user) {
        return new Promise((resolve, reject) => {
          try {
            let movimentos = user['movimentos'];
            let tamanho = movimentos.length;
      
            for (let x = 1; x < tamanho; x++) {
              if (movimentos[x - 1]['data'] < movimentos[x]['data']) {
                for (let y = x; y > 0; y--) {
                  let a = movimentos[y - 1];
                  let b = movimentos[y];
      
                  if (a['data'] < b['data']) {
                    movimentos[y - 1] = b;
                    movimentos[y] = a;
                  }
                }
              }
            }
      
            this.guardarUser(JSON.stringify(user, null, 2));
      

            resolve(user);
          } catch (error) {
            reject(error);
          }
        });
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


