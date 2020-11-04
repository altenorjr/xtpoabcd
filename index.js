const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const Handlebars = require("handlebars");
const htmlPdf = require("html-pdf");

const app = express();

const template = fs.readFileSync(`${__dirname}/template.html`, {
  encoding: "utf-8",
});

app.use(express.json());

app.get("/template.html", (req, res) => {
  res.header("content-type", "text/html");

  res.send(template);
});

const templatePath = "/template.html";

app.post("/certificado", async (req, res) => {
  const certificadoText = await fetch(templatePath).then((res) => res.text());

  const template = Handlebars.compile(certificadoText);

  const html = template(req.body);

  htmlPdf.create(html).toStream((_, stream) => {
    res.header("content-type", "application/pdf");
    res.header(
      "content-disposition",
      `attachment; filename="certificado-${req.body.studentName}.pdf"`
    );

    stream.pipe(res);
  });
});

app.listen(process.env.PORT, () => console.log("READY"));
