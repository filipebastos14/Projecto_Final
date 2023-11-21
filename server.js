const express = require("express");
const mysql = require("mysql");
const expressLayouts = require("express-ejs-layouts");
const userPath = "./models/user.json";
const session = require("express-session");

const ejs = require("ejs");
const path = require("path");
const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Pasta de ficheiros estáticos
app.use(express.static("public"));

// Definir main Layout
app.use(expressLayouts);
app.set("layout", "layout/main");

app.use(
  session({
    secret: "fc22e0b3d3bb7872a7192e1c0184473c2e0b37e9c9b6590a47b697f97429e874",
    resave: false,
    saveUninitialized: true,
  })
);

// Configuração do ejs
app.set("view engine", "ejs");
app.set("views", path.join("views/"));

// Conexão DB
const DbConnect = require("./db/db");
const db = DbConnect.getDbConnectInstance();

const userModel = require("./controllers/userController");
const userModelFunctions = userModel.getUserInstance();

//pagina de login
app.get("/login", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.render("login/login", { layout: "layout/visitor" });
  } else {
    res.redirect("/");
  }
});

// pagina de registo
app.get("/register", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.render("login/newUser", { layout: "layout/visitor" });
  } else {
    res.redirect("/");
  }
});

// pagina de recuperação
app.get("/reset", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.render("login/recoverPassword", { layout: "layout/visitor" });
  } else {
    res.redirect("user_account/index");
  }
});

// Homepage
app.get("/", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.redirect("/login");
  } else {
    userOutput = await userModelFunctions.userInfo(userId);
    res.render("user_account/index", userOutput);
  }
});

// Página detalhes da conta
app.get("/detalhes", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.redirect("/login");
  } else {
    userOutput = await userModelFunctions.userInfo(userId);
    res.render("user_account/accountsDetails", userOutput);
  }
});

// Página de categorias/estatisticas
app.get("/categorias", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.redirect("/login");
  } else {
    userOutput = await userModelFunctions.userInfo(userId);
    res.render("user_account/categories", userOutput);
  }
});

// pagina de movimentos
app.get("/movimentos", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.redirect("/login");
  } else {
    userOutput = await userModelFunctions.userInfo(userId);
    res.render("user_account/movements", userOutput);
  }
});

app.get("/movimentos/:id/update/:value/:field", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.redirect("/login");
  } else {
    userOutput = await userModelFunctions.userInfo(userId);

    db.atualizarMovimento(req.params.value, req.params.value, req.params.field);
    res.render("user_account/movements", userOutput);
  }
});

app.post("/user/new", async (req, res) => {
  try {
    let object = req.body;

    const result = await db.verificarUtilizador(object.email);

    if (result != null) {
      // Mensagem de conflito
      res
        .status(409)
        .json({
          error:
            "Este email já está registado, registe-se com outro email ou faça login",
        });
    } else {
      // Procede com registo
      await db.registarUtilizador(object);
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user/login", async (req, res) => {
  try {
    const email = req.query.email;
    const pass = req.query.pass;

    let result = await db.verificarUtilizador(email);

    if (result != null) {
      const user = result[0];

      // compara email e pass com resultados da query
      if (user.pass == pass) {
        // se corresponder
        const userId = user.id;

        req.session.userId = userId;

        res.json({ success: true, userId: userId });
      } else {
        // se dados não corresponderem
        res.status(401).json({ error: "Email ou pass incorretos" });
      }
    } else {
      res.status(409).json({ error: "Utilizador não encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/user/reset", async (req, res) => {
  try {
    object = req.body;

    let result = await db.verificarUtilizador(object["email"]);

    if (result != null) {
      await db.atualizarUtilizador(object);

      res.redirect("/login");
    } else {
      res.status(409).json({ error: "Utilizador não encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }

      res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete-movement/:id", (req, res) => {
  try {
    const movimentoId = parseInt(req.params.id);

    const resultado = db.apagarMovimento(movimentoId);

    res.redirect("/movimentos");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DATA

// Saldo actual
app.get("/saldoActual", async (req, res) => {
  let result = await db.saldoActual(req.query.userId);
  res.send(result);
});

//Ultimos movimentos
app.get("/ultimosMovimentos", async (req, res) => {
  let result = await db.ultimosMovimentos(req.query.userId);

  res.send(result);
});

//Movimentos anual
app.get("/movimentosAnual", async (req, res) => {
  let result = await db.movimentosAnuais(req.query.userId);

  res.send(result);
});

app.get("/movimentosTotais", async (req, res) => {
  let result = await db.movimentosTotais(req.query.userId);

  res.send(result);
});

app.get("/getCategorias", async (req, res) => {
  let result = await db.categorias();

  res.send(result);
});

app.post("/inserirMovimento", async (req, res) => {
  let result = await db.inserirMovimento(
    req.body.descricao,
    req.body.valor,
    req.body.data,
    req.body.categoria,
    req.body.fixo,
    req.body.tipo,
    req.body.user
  );

  res.send(result);
});

app.get("/proximasDespesas", async (req, res) => {
  let result = await db.proximasDespesas(req.query.userId);

  res.send(result);
});

app.get("/despesasFixasMensais", async (req, res) => {
  let result = await db.despesasFixasMensais(req.query.userId);

  res.send(result);
});

app.post("/novaCategoria", async (req, res) => {
  let result = await db.novaCategoria(req.query.name);

  res.send(result);
});

app.get("/despesasMensais", async (req, res) => {
  let result = await db.despesasMensais(req.query.userId);

  res.send(result);
});

app.get("/detalhesConta", async (req, res) => {
  let result = await db.detalhesConta(req.query.userId);

  res.send(result);
});

app.get("/variacaoSemestral", async (req, res) => {
  let result = await db.variacaoSemestral(req.query.userId);

  res.send(result);
});

app.get("/maioresGastos", async (req, res) => {
  let result = await db.maioresGastos(req.query.userId);

  res.send(result);
});

app.get("/rendimentosMensais", async (req, res) => {
  let result = await db.rendimentosMensais(req.query.userId);

  res.send(result);
});

app.get("/percentagensAnuais", async (req, res) => {
  let result = await db.percentagensAnuais(req.query.userId);

  res.send(result);
});

app.get("/saldoPrevisto", async (req, res) => {
  let result = await db.saldoPrevisto(req.query.userId);

  res.send(result);
});

app.listen(port, () => {
  console.log("Connected");
});
