const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// URL de conexão com o banco de dados
const url = 'mongodb://localhost:27017/PIS';
const nome ='PIS_12294802677'

// Caminho para o diretório onde os arquivos JSON serão salvos
const diretorioSalvar = 'C:/Users/PREDATOR/Documents/SERVIDOR/appWeb-desenvolvimento/leads';

// CAMPOS OBSERVACOES OU CID_OBS OU NAT_LESAO
// Expressão de consulta
const query = {PIS:'12294802677'}; 

// Função para conectar ao banco de dados e realizar a consulta
async function consultarBancoDeDados() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar ao banco de dados
    const database = client.db(); // Selecionar o banco de dados
    const collections = await database.listCollections().toArray(); // Listar todas as coleções

    // Iterar sobre as coleções e realizar a consulta em cada uma
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = database.collection(collectionName);
      const result = await collection.find(query).toArray();

      if (result.length > 0) {
        console.log(`Resultados da consulta em ${collectionName}:`, result);

        // Salvar resultados em um arquivo JSON para cada coleção diretamente no diretório
        const caminhoArquivo = path.join(diretorioSalvar, `${nome}_${collectionName}.json`);
        fs.writeFileSync(caminhoArquivo, JSON.stringify(result, null, 2));
        console.log(`Resultados da coleção ${collectionName} salvos em: ${caminhoArquivo}`);
      } else {
        console.log(`Nenhum resultado da consulta em ${collectionName}`);
      }
    }
  } finally {
    await client.close(); // Fechar a conexão com o banco de dados
  }
}

// Chamar a função para iniciar a consulta
consultarBancoDeDados();
