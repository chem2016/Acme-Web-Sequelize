const Sequelize = require('sequelize');
// const connection = new Sequelize('postgres://localhost/AcmeUserSequelize');

const connection = new Sequelize('AcmeUserSequelize1','haoyuyu','',{
    dialect: 'postgres',
    logging: false,
})

const Page = connection.define('page',{
    name: {
        type: Sequelize.STRING,
    },
})

const Content = connection.define('content',{
    title: {
        type: Sequelize.STRING,
    },
    body: {
        type: Sequelize.STRING,
    }
})

// Page.hasMany(Content);
// Content.belongsTo(Page);

//    connection.sync({force: true})
//     .then(()=>Promise.all([
//         Page.create({name: 'Home'}),
//         Page.create({name: 'Employees'}),
//         Page.create({name: 'Contact'}),
//     ]))
//     .then(([homePage, employeesPage, contactPage])=>{
//         Content.create({title: 'Welcome Home 1', body: 'xoxoxo', pageId: homePage.id}),
//         Content.create({title: 'Welcome Home 2', body: 'xoxoxo', pageId: homePage.id}),
//         Content.create({title: 'LARRA', body: 'CTO', pageId: employeesPage.id}),
//         Content.create({title: 'MOE', body: 'CEO', pageId: employeesPage.id}),
//         Content.create({title: 'CURLY', body: 'COO', pageId: employeesPage.id}),
//         Content.create({title: 'Phone', body: '212-555-1212', pageId: contactPage.id}),
//         Content.create({title: 'Telex', body: '212-555-1213', pageId: contactPage.id}),
//         Content.create({title: 'FAX', body: '212-555-1214', pageId: contactPage.id})
//     })


const setupDb = async () => {
    Page.hasMany(Content);
    Content.belongsTo(Page);
  
    await connection.sync({ force: true });
  
    const [homePage, employeesPage, contactPage] = await Promise.all([
      Page.create({name: 'Home'}),
      Page.create({name: 'Employees'}),
      Page.create({name: 'Contact'}),
    ]);
  
    const home1contentCreated = await Content.create({ title: 'Welcome Home 1', body: 'xoxoxo' });
    const home1associatedContent = await home1contentCreated.setPage(homePage);
    const home2contentCreated = await Content.create({ title: 'Welcome Home 2', body: 'xoxoxo' });
    const home2associatedContent = await home2contentCreated.setPage(homePage);      
    const Emp1contentCreated = await Content.create({ title: 'LARRY', body: 'CTO' });
    const Emp1associatedContent = await Emp1contentCreated.setPage(employeesPage);     
    const Emp2contentCreated = await Content.create({ title: 'MOE', body: 'CEO' });
    const Emp2associatedContent = await Emp2contentCreated.setPage(employeesPage);
    const Emp3contentCreated = await Content.create({ title: 'CURLY', body: 'COO' });
    const Emp3associatedContent = await Emp3contentCreated.setPage(employeesPage);
    const Cont1contentCreated = await Content.create({ title: 'Phone', body: '212-555-1212' });
    const Cont1associatedContent = await Cont1contentCreated.setPage(contactPage);
    const Cont2contentCreated = await Content.create({ title: 'Telex', body: '212-555-1213' });
    const Cont2associatedContent = await Cont2contentCreated.setPage(contactPage);
    const Cont3contentCreated = await Content.create({ title: 'FAX', body: '212-555-1214' });
    const Cont3associatedContent = await Cont3contentCreated.setPage(contactPage);

  
    // I dont know what you want to return...
  }





// const getPages = ()=>{
//     console.log('in the db.js file')
//     //console.log(Page.getTableName());
//     return Page.findByPk(1)
//         .then((page)=>{
//             console.log(page.dataValues)
//         })        
// }

const getPages = () =>{
    return Page.findAll({
        attributes: ['id','name']
    })
    .then((pages)=>
        //console.log(Array.isArray(pages))
        pages.map((page)=>{
            return page.dataValues;
        })
    )
}

const getPage = (Pk) =>{
    return Page.findByPk(Pk)
        // .then((page)=>page)
}

const getContentByPageId = (id) => {
    return Content.findAll({
        where: {pageId: id}
    })
    .then(contents => contents.map(content => {
        return content.dataValues
    }))
}

module.exports = {
    setupDb,
    getPage,
    getPages,
    getContentByPageId,
}