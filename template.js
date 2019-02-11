const express = require('express');
const app = express();
const db = require('./db');

const renderNav = (pages, page)=> {
  return `
    <ul>
      ${
        pages.map( _page => {
          return `
            <li ${ page.id === _page.id ? 'style="font-weight:bold"': ''}/>
              <a href='/pages/${_page.id}'>
              ${ _page.title }
              </a>
            </li>
          `;
        }).join('')
      }
    </ul>
  `;
};

const renderContents = (contents)=> {
  return `
    <ul>
      ${
        contents.map( content => {
          return `
            <li>
              ${ content.title }
              <br />
              ${ content.body }
            </li>
          `;
        }).join('')
      }
    </ul>
  `;
};

const renderPage = ({ page, pages, contents})=> {
  return `
    <html>
      <head>
        <title>Acme Web ${ page.title }</title>
      </head>
    <body>
    ${ renderNav(pages, page)}
    <h1>${page.title}</h1>
    ${ renderContents(contents)}
    </body>
    </html>
  `;
};

app.use((req, res, next)=> {
  db.getPages()
    .then( pages => {
      req.pages = pages;
      next();
    })
    .catch(next);
});

app.get('/', (req, res, next)=> {
  const homePage = req.pages.find( page => page.is_home_page);
  res.redirect(`/pages/${homePage.id}`);
});

app.get('/pages/:id', (req, res, next)=> {
  const page = req.pages.find(page => page.id === req.params.id*1);
  db.getContents(page.id)
    .then( contents => {
      res.send(renderPage({ page, pages: req.pages, contents }));
    })
    .catch(next);
});

module.exports = app;