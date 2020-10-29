const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const generateDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month > 9 ? month : '0' + month}/${day > 9 ? day : '0' + day}`;
}

const URL = `https://www.estrellavalpo.cl/impresa/${generateDate()}/papel/`;

const download = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

function load_pages(pages) {
  
  if (!fs.existsSync('exports')) {
    fs.mkdirSync('exports');
  }
  const images_path = 'exports/EstrellaValparaiso_' +  generateDate().replace(/\//g, '-')
  if (fs.existsSync(images_path)){
    fs.rmdirSync(images_path, {recursive: true})
  }
  fs.mkdirSync(images_path);
  
  for (page of pages) {
    download(page.url, images_path + '/' + page.name + '.jpg');
  }
}


function parse(html) {
  const $ = cheerio.load(html);
  const pages_divs = $('#content .home-pages > .row > div.page');
  const pages = [];
  pages_divs.each(function() {
    pages.push({
      name: $(this).data('cuerpo') + ' - ' + $(this).attr('id'),
      url: $(this).find('img').data('src')
    });
  });
  load_pages(pages);
}

function run() {
  axios.get(URL)
    .then(response =>
      parse(response.data)
    );
}
run();