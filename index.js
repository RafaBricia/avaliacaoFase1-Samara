const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./database/db.js");


const AlunoRoute = require("./routes/alunoRoutes.js");
const DisciplinaRoute = require("./routes/disciplinaRoutes.js");
const LoginRoute = require("./routes/loginRoute.js");
const PerfilRoute = require('./routes/perfilRoutes.js');
const ProfessorRoute = require('./routes/professorRoutes.js');
const TarefaRoute = require('./routes/tarefaRoutes.js');
const TurmaRoute = require('./routes/turmaRoutes.js');


app.use(bodyParser.json()); 

app.use("/api",LoginRoute);
app.use("/api",TurmaRoute);
app.use("/api", AlunoRoute);
app.use("/api",DisciplinaRoute);
app.use("/api",ProfessorRoute);
app.use("/api",TarefaRoute);
app.use("/api", PerfilRoute);

const port = 3000;
app.listen(port, () => {

  console.log(`Aplicação rodando na porta ${port}`);

});