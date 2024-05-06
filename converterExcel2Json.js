const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const inputFolder = 'D:/converter';
const outputFolder = 'D:/CONVERTIDOS';


// Função para converter um arquivo Excel para JSON
async function excelToJson(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  const rows = [];
  const headerRow = worksheet.getRow(1).values;

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) { // Ignora o cabeçalho
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        const columnHeader = headerRow[colNumber]; // Indexa as colunas corretamente
        const cellValue = cell.value;
        // Mantém todos os campos, incluindo os vazios
        rowData[columnHeader] = cellValue !== undefined ? (isNaN(cellValue) ? cellValue : cellValue.toString()) : '';
      });
      rows.push(rowData);
    }
  });

  return rows;
}


// Função para ler os arquivos da pasta e converter para JSON
async function convertExcelFilesToJson() {
  try {
    const files = fs.readdirSync(inputFolder);
    for (const file of files) {
      const filePath = path.join(inputFolder, file);
      if (filePath.endsWith('.xlsx')) {
        const jsonData = await excelToJson(filePath);
        const jsonFileName = file.replace('.xlsx', '.json');
        const jsonFilePath = path.join(outputFolder, jsonFileName);
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
        console.log(`Arquivo convertido: ${jsonFileName}`);
      }
    }
    console.log('Conversão concluída!');
  } catch (error) {
    console.error('Erro ao converter arquivos:', error);
  }
}

// Chama a função para converter os arquivos Excel para JSON
convertExcelFilesToJson();
