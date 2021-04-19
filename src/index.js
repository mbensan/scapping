//const axios = require('axios');
//const cheerio = require('cheerio');
//const fs = require('fs');
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import {medias, generateDate, downloadImage} from './utils.js'

const URL = `https://www.australtemuco.cl/impresa/${generateDate()}/papel/`;

function load_pages(pages) {
  
  if (!fs.existsSync('exports')) {
    fs.mkdirSync('exports');
  }
  const images_path = 'exports/AustralTemuco_' +  generateDate().replace(/\//g, '-')
  if (fs.existsSync(images_path)){
    fs.rmdirSync(images_path, {recursive: true})
  }
  fs.mkdirSync(images_path);
  console.log(pages);
  for (page of pages) {
    downloadImage(page.url, images_path + '/' + page.name + '.jpg');
  }
}


function parse(html) {
  const $ = cheerio.load(html);
  const pages_divs = $('#content .home-pages > .row > div.page');
  const pages = [];
  pages_divs.each(function() {
    console.log($(this).html());
    pages.push({
      name: $(this).data('cuerpo') + ' - ' + $(this).attr('id'),
      url: $(this).find('img').data('src')
    });
  });
  //load_pages(pages);
}

function run() {
  axios.get(URL)
    .then(response =>
      parse(response.data)
    );
}
run();