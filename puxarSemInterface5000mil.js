const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// URL de conexão com o banco de dados
const url = 'mongodb://localhost:27017/CAT_COMPLETO';
const nome ='Fratura'

// Caminho para o diretório onde os arquivos JSON serão salvos
const diretorioSalvar = 'C:/Users/PREDATOR/Documents/SERVIDOR/appWeb-desenvolvimento/leads';

// CAMPOS OBSERVACOES OU CID_OBS OU NAT_LESAO
// Expressão de consulta
const query = {NAT_LESAO: {$regex : /fratura/i }}; 

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
  
          // Dividir os resultados em arquivos com no máximo 50 mil objetos por arquivo
          const chunks = [];
          const chunkSize = 30000;
          for (let i = 0; i < result.length; i += chunkSize) {
            chunks.push(result.slice(i, i + chunkSize));
          }
  
          // Salvar cada chunk em um arquivo JSON separado
          for (let j = 0; j < chunks.length; j++) {
            const caminhoArquivo = path.join(diretorioSalvar, `${nome}_${collectionName}_${j + 1}.json`);
            fs.writeFileSync(caminhoArquivo, JSON.stringify(chunks[j], null, 2));
            console.log(`Chunk ${j + 1} da coleção ${collectionName} salvo em: ${caminhoArquivo}`);
          }
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
