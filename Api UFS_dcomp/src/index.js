const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const app = express();
app.use(express.json());
const subjects = [];

function logRequests(request, response, next) {
  const { method, url } = request;
  const loglabel = `[${method.toUpperCase()} ${url}]`;

  console.time(loglabel);
  next();
  console.timeEnd(loglabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }

  return next();
}

app.use(logRequests);
app.use('/subjects/:id', validateProjectId)

app.get("/subjects", (request, response) => {
  const { discipline } = request.query;
  const result_disc = discipline
    ? subjects.filter((subject) => subject.discipline.includes(discipline))
    : subjects;

  return response.json(result_disc);
});

app.post("/subjects", (request, response) => {
  const { discipline, teacher } = request.body;
  const subject = { id: uuid(), discipline, teacher };

  subjects.push(subject);

  return response.json(subject);
});

app.put("/subjects/:id", (request, response) => {
  const { id } = request.params;
  const { discipline, teacher } = request.body;

  const subjectIndex = subjects.findIndex((subject) => subject.id === id);

  if (subjectIndex < 0) {
    return response.status(404).json({ error: "Subject not found." });
  }

  const subject = {
    id,
    discipline,
    teacher,
  };

  subjects[subjectIndex] = subject;

  return response.json(subject);
});

app.delete("/subjects/:id", (request, response) => {
  const { id } = request.params;
  const { discipline, teacher } = request.body;
  const subjectIndex = subjects.findIndex((subject) => subject.id === id);

  if (subjectIndex < 0) {
    return response.status(404).json({ error: "Subject not found." });
  }

  subjects.splice(subjectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("Back-end started!");
});
