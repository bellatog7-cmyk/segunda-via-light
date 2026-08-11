const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

const LIGHT_OFICIAL = "https://www.light.com.br/SitePages/home.aspx";
const LIGHT_ATENDIMENTO = "https://www.light.com.br/SitePages/page-atendimento-light.aspx";
const LIGHT_CONTA = "https://www.light.com.br/SitePages/page-entenda-a-conta-da-sua-casa.aspx";

function data(req) {
  const host = req.get("host") || "seu-projeto.vercel.app";
  const protocol = req.headers["x-forwarded-proto"] || "https";

  return {
    siteUrl: `${protocol}://${host}`,
    lightOficial: LIGHT_OFICIAL,
    lightAtendimento: LIGHT_ATENDIMENTO,
    lightConta: LIGHT_CONTA
  };
}

app.get("/", (req, res) => res.render("index", data(req)));

// URLs oficiais
app.get("/light-segunda-via", (req, res) =>
  res.render("segunda-via", data(req))
);

app.get("/light-fatura", (req, res) =>
  res.render("fatura", data(req))
);

// Redirecionamento das URLs antigas para as novas
app.get("/segunda-via", (req, res) =>
  res.redirect(301, "/light-segunda-via")
);

app.get("/fatura", (req, res) =>
  res.redirect(301, "/light-fatura")
);

// Robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(
`User-agent: *
Allow: /

Sitemap: ${data(req).siteUrl}/sitemap.xml`
  );
});

// Sitemap
app.get("/sitemap.xml", (req, res) => {
  const siteUrl = data(req).siteUrl;

  res.type("application/xml").send(
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc></url>
  <url><loc>${siteUrl}/light-segunda-via</loc></url>
  <url><loc>${siteUrl}/light-fatura</loc></url>
</urlset>`
  );
});

app.use((req, res) => res.status(404).render("404", data(req)));

module.exports = app;
