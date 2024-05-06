const fs = require('fs');
const path = require('path');

const folderPath = 'D:/converterToNum'; // Substitua pelo caminho da sua pasta

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Erro ao ler a pasta:', err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(folderPath, file);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Erro ao ler o arquivo ${file}:`, err);
          return;
        }

        try {
          const jsonData = JSON.parse(data);
          const updatedData = jsonData.map(item => ({
            ...item,
            CPF: Number(item.CPF.replace(/"/g, '')),
            CNPJ: Number(item.CNPJ.replace(/"/g, '')),
            PIS: Number(item.PIS.replace(/"/g, '')),
          }));

          const updatedJson = JSON.stringify(updatedData, null, 2);
          fs.writeFile(filePath, updatedJson, 'utf8', err => {
            if (err) {
              console.error(`Erro ao escrever o arquivo ${file}:`, err);
              return;
            }
            console.log(`Arquivo ${file} atualizado com sucesso.`);
          });
        } catch (err) {
          console.error(`Erro ao processar o arquivo ${file}:`, err);
        }
      });
    }
  });
});
