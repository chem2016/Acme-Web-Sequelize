const express = require('express');
const app = express();
const db = require('./db');

const renderNav = (pages, page) =>{
    return `
      <ul class="nav nav-tabs">
        ${
            pages.map( _page => {
                return `
                  <li class="nav-item" ${ page.id === _page.id ? 'style="font-weighted:bold"': ''}/>
                    <a class="nav-link" href='/pages/${_page.id}'>
                    ${_page.name}
                    </a>
                  </li>
                `;
            }).join('')
        }
      </ul>
    `;
};

const renderContents = (contents) =>{
    return `
      <ul>
        ${
            contents.map( content =>{
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

const renderPage = ({page, pages, contents}) =>{
    return `
      <html>
        <head>
            <link rel='stylesheet' type='text/css'      href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css'' />
            <title>Acme Web ${page.name}</title>
        </head>
        <body>
            <div class='container'>
                <div style='font-size: 40px'>Acme Web</div>
                <h1>${page.name}</h1>
                ${ renderNav(pages, page)}
                ${ renderContents(contents)}
            </div>
        </body>
      </html>
    `;
};


app.use((req, res, next) =>{
    db.getPages()
        .then((pages)=>{
            req.pages = pages;
            next();
        })
        .catch(next)
});

app.get('/',(req, res, next)=>{
    res.redirect(`/pages/${1}`);
    next();
});

app.get('/pages/:id',(req, res, next)=>{
    const page = req.pages.find(page => page.id === req.params.id*1);
    console.log(page);
    db.getContentByPageId(page.id)
        .then( contents => {
            res.send(renderPage({page, pages: req.pages, contents}));
        })
        .catch(next);
    

    // db.getPage(req.params.id)
    //     .then((page)=> res.send(page));
});

module.exports = app;
