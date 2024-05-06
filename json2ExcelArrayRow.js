const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const jsonFolder = 'C:/Users/PREDATOR/Documents/SERVIDOR/GeradorDeExcel';
const jsonFiles = fs.readdirSync(jsonFolder).filter(file => file.endsWith('.json'));

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Dados');

// Function to flatten nested objects
const flattenObject = (obj, prefix = '') => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            Object.assign(result, flattenObject(value, `${prefix}${key}_`));
        } else {
            result[`${prefix}${key}`] = value;
        }
    }
    return result;
};

// Set to store all field names across all JSON files
const allFieldNames = new Set();

jsonFiles.forEach(jsonFile => {
    const jsonFilePath = path.join(jsonFolder, jsonFile);

    try {
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        if (Array.isArray(jsonData) && jsonData.length > 0) {
            jsonData.forEach(objeto => {
                Object.entries(objeto).forEach(([fieldName, fieldValue]) => {
                    worksheet.addRow([fieldName, fieldValue]);
                });
            });
        } else {
            console.error(`O arquivo JSON ${jsonFile} está vazio ou não é um array.`);
        }
    } catch (jsonError) {
        console.error(`Erro ao analisar o JSON do arquivo ${jsonFile}:`, jsonError);
    }
});





const excelOutputPath = 'C:/Users/PREDATOR/Documents/SERVIDOR/SaidaExcel/Filtro_Nao_existe_4.xlsx';

workbook.xlsx.writeFile(excelOutputPath)
    .then(() => {
        console.log(`Conversão concluída. Arquivo Excel salvo em: ${excelOutputPath}`);
    })
    .catch(error => {
        console.error('Erro ao salvar o arquivo Excel:', error);
    });
