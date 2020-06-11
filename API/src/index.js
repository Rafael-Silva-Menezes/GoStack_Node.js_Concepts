const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const app = express();
const contacts = require("./contacts");
app.use(express.json());

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel)
  return next();
}

function validProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID" });
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validProjectId);

app.get("/projects", logRequests, (request, response) => {
  const { name } = request.query;
  const results = name
    ? contacts.filter((contact) => contact.name.includes(name))
    : contacts;

  return response.json(results);
});

app.post("/projects", (request, response) => {
  const { name, email, phoneNumber } = request.body;
  const contact = { id: uuid(), name, email, phoneNumber };

  contacts.push(contact);

  return response.json(contact);
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { name, email, phoneNumber } = request.body;
  const contactIndex = contacts.findIndex((contact) => contact.id === id);

  if (contactIndex < 0) {
    return response.status(400).json({ error: "Contact not found" });
  }

  const contact = {
    id,
    name,
    email,
    phoneNumber,
  };

  contacts[contactIndex] = contact;

  return response.json(contact);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;
  const contactIndex = contacts.findIndex((contact) => contact.id === id);

  if (contactIndex < 0) {
    return response.status(400).json({ error: "Contact not found" });
  }

  contacts.splice(contactIndex, 1);

  return response.status(202).send();
});

app.listen(3333, () => {
  console.log("Back-end started");
});
