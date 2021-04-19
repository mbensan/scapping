export const medias = [
  {
    id: 'EstrellaValpo',
    url: 'estrellavalpo',
    name: 'La Estrella de Valparaiso'
  },
  {
    id: 'AustralTemuco',
    url: 'australtemuco',
    name: 'El Austral de Temuco'
  }
];

export const generateDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month > 9 ? month : '0' + month}/${day > 9 ? day : '0' + day}`;
}

export const downloadImage = (url, image_path) =>
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