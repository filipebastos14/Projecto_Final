const mysql = require("mysql");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
let instance = null;

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testepf",
    port: "3306"
})

con.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("DB: " + con.state);
});

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
                        resolve(result.length > 0 ? result : null);
                    }
                });
            });
        } catch (error) {
          return error;
        }
    }

    async verificarUtilizadorID(id) {
      try {
          return new Promise((resolve, reject) => {
              let query = 'SELECT id, nome, email, pass FROM utilizador WHERE id = ?';
  
              con.query(query, id, (err, result) => {
                  if (err) {
                      reject(new Error(err.message));
                  } else {
                      resolve(result.length > 0 ? result : null);
                  }
              });
          });
      } catch (error) {
          return error;
      }
  }

    async registarUtilizador(object) {
        try {
            return await new Promise((resolve, reject) => {

              let query = "insert into utilizador(nome,email,pass) values (?)"
              let convertedObject = [[object.nome,object.email,object.pass]]

              con.query(query, convertedObject, (err, result) => {
                if (err) {
                  reject(new Error(err.message));
                } else {
                  resolve(result);
                }
              });
            });

        } catch (error) {
            console.log(error);
        }
    }


  async movimentosUtilizador(id) {
    try {
      let result = await new Promise((resolve, reject) => {
        let query =
          "SELECT c.categoria AS cat, m.valor AS val, m.data AS data, m.descricao AS descr, m.tipo AS tipo, m.id AS id FROM movimento m JOIN categoria c ON m.id_categoria = c.id WHERE m.id_utilizador = ? ORDER BY `m`.`data` DESC";
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
      let query =
        "INSERT INTO movimento (id_utilizador, id_categoria, valor, data_movimento, descricao, tipo_movimento) VALUES (?)";

      const result = await new Promise((resolve, reject) => {
        con.query(
          query,
          [
            [
              object.user,
              object.categoria,
              object.valor,
              object.data,
              object.descricao,
              object.tipo,
            ],
          ],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });

      return result;
    } catch (error) {
      console.error("Error:", error);
      throw new Error(error.message);
    }
  }

  async apagarMovimento(id_utilizador) {
    let result = await new Promise((resolve, reject) => {
      let query = 'DELETE FROM movimento WHERE id = ?';

      con.query(query, id_utilizador,  (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async atualizarUtilizador(object) {
        
    try {
        return await new Promise((resolve, reject) => {

            let query = `update utilizador set pass = '${object.pass}' where email = '${object.email}'`
            console.log(query);
            con.query(query,(err,result) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    resolve(result);
                }
            })
        })

    } catch (error) {
        console.log("catch 3: "+error);
    }
}

  async saldoActual(id_utilizador) {
    let result = await new Promise((resolve, reject) => {
      let sql = `SELECT ROUND(SUM(valor), 2) as total FROM movimento WHERE id_utilizador = ${id_utilizador} and data <= CURRENT_DATE();`;

      con.query(sql,  (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  // DATA

  async ultimosMovimentos(id_utilizador) {
    let result = await new Promise((resolve, reject) => {
      let sql = `SELECT id, descricao, valor, data, tipo 
    from movimento 
    WHERE id_utilizador = ${id_utilizador} and data <= CURRENT_DATE()
    order by data desc
    limit 10;`;

      con.query(sql, (error, results) => {

        resolve(results);
      });
    });

    return result;
  }

  async movimentosAnuais(id_utilizador) {
    let result = await new Promise((resolve, reject) => {
      let sql = `select month(data) as mes, sum(valor) as valor
                from movimento
                where id_utilizador = ${id_utilizador}
                and tipo = 1
                group by mes
                order by mes;`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async movimentosTotais(id_utilizador) {
    let result = await new Promise((resolve, reject) => {
      let sql = `select id, data, valor, descricao, tipo
        from movimento
        where fixo = 0 and data <= CURRENT_DATE()
        and id_utilizador = ${id_utilizador}
        order by data desc;`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async categorias(id_utilizador) {
    let result = await new Promise((resolve, reject) => {
      let sql = `select categoria, id from categoria;`;

      con.query(sql, (error, results) => {
          resolve(results);
        });
    });
    
    return result;
  }

  async inserirMovimento(desc, valor, data, cat, fixo, tipo, userId) {
    let result = await new Promise((resolve, reject) => {
      let sql = `insert into movimento
        (
        descricao,
        valor,
        data,
        id_categoria,
        id_utilizador,
        fixo,
        tipo
        ) values
        (
        "${desc}",
         ${valor},
         "${data}",
         ${cat},
         ${userId},
         ${fixo} ,
         ${tipo}
        )`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async proximasDespesas(id_utilizador) {

    let result = await new Promise((resolve, reject) => {
      let sql = `select id, data, valor, descricao
        from movimento
        where fixo = 0
        and data > CURRENT_DATE()
        and id_utilizador = ${id_utilizador}
        order by data;`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async despesasFixasMensais(id_utilizador) {
    let result = await new Promise((resolve, reject) => {
      let sql = `select id, data, valor, descricao, tipo
        from movimento
        where fixo = 1
        and id_utilizador = ${id_utilizador}
        order by descricao;`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async novaCategoria(name) {
    let result = await new Promise((resolve, reject) => {
      let sql = `insert into categoria
    (
    categoria
    ) values
    (
    "${name}"
    )`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async despesasMensais(id_utilizador) {
    let result = await new Promise((resolve, reject) => {
      let sql = `select sum(valor) as valor, c.categoria
        from movimento m
        join categoria c 
        on m.id_categoria = c.id_categoria
        where id_utilizador = ${id_utilizador}
        group by c.categoria;`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async detalhesConta(id_utilizador) {
    let result = await new Promise((resolve, reject) => {
      let sql = `select u.nome, u.email, a.saldo
      from utilizador u,(select round(SUM(m.valor), 2) as saldo from movimento m where id_utilizador = ${id_utilizador}) a where id = ${id_utilizador};`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async despesasMensais(id_utilizador) {
    const dataActual = new Date();
    let result = await new Promise((resolve, reject) => {
      let sql = `select round(sum(m.valor), 2) as valor, c.categoria
      from movimento m, categoria c
      where m.id_categoria = c.id
      and m.id_utilizador = ${id_utilizador}
      and month(m.data) = '${dataActual.getMonth()+1}'
      and year(m.data) = '${dataActual.getFullYear()}'
      group by c.categoria;`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async variacaoSemestral(id_utilizador) {
    const dataActual = new Date();
    let result = await new Promise((resolve, reject) => {
      let sql = `select p1.valor as PrimeiroPeriodo, p2.valor  as SegundoPeriodo
      from (select sum(m.valor) as valor
          from movimento m
          where (m.data between '2023-01-01' and '2023-05-31') 
          and m.id_utilizador = ${id_utilizador}) as p1,
          (select sum(m.valor) as valor
          from movimento m
          where (m.data between '2023-06-01' and '2023-12-31')
          and m.id_utilizador = ${id_utilizador}) as p2;`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async maioresGastos(id_utilizador) {
    const dataActual = new Date();
    let result = await new Promise((resolve, reject) => {
      let sql = `select round(m.valor, 2) as valor, m.descricao
      from movimento m
      where year(m.data) = '${dataActual.getFullYear()}'
      and id_utilizador = ${id_utilizador}
      order by m.valor desc
      limit 10;`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }

  async rendimentosMensais(id_utilizador) {
    const dataActual = new Date();
    let result = await new Promise((resolve, reject) => {
      let sql = `select round(sum(m.valor),2) as valor, month(m.data) as month
      from movimento m
      where year(m.data) = '${dataActual.getFullYear()}'
      and m.tipo = 0
      and m.id_utilizador = ${id_utilizador}
      group by month
      order by month asc;`;

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }


  async percentagensAnuais(id_utilizador) {
    const dataActual = new Date();
    let result = await new Promise((resolve, reject) => {
      let sql = `select c.categoria as name, round(sum(m.valor)*100/a.total, 2) as percentage
      from categoria c, movimento m, (select round(sum(m.valor), 2) as total from movimento m where year(m.data) = '${dataActual.getFullYear()}' and m.id_utilizador = ${id_utilizador}) a
      where c.id = m.id_categoria
      and m.id_utilizador = ${id_utilizador}
      and year(m.data) = '${dataActual.getFullYear()}'
      group by c.categoria, a.total;`;

      console.log(sql)

      con.query(sql, (error, results) => {
        resolve(results);
      });
    });

    return result;
  }
}

module.exports = DbConnect;
