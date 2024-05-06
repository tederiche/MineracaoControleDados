const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function connectToMongoDB() {
    const uri = 'mongodb://localhost:27017/CAT_COMPLETO';
    
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    try {
        await client.connect();
        console.log('Conectado ao MongoDB');
        return client.db();
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        return null;
    }
}

async function inserirDadosPorPasta(db, caminhoPasta) {
    try {
        const pastas = fs.readdirSync(caminhoPasta);
        for (const pasta of pastas) {
            const caminhoPastaCompleto = path.join(caminhoPasta, pasta);
            if (fs.statSync(caminhoPastaCompleto).isDirectory()) {
                const arquivos = fs.readdirSync(caminhoPastaCompleto);
                for (const arquivo of arquivos) {
                    const caminhoArquivoJSON = path.join(caminhoPastaCompleto, arquivo);
                    const conteudoArquivo = fs.readFileSync(caminhoArquivoJSON, 'utf8');
                    const dadosJSON = JSON.parse(conteudoArquivo);
                    const colecao = db.collection(pasta);
                    await colecao.insertMany(dadosJSON);
                    console.log(`Dados da pasta ${pasta} inseridos com sucesso no MongoDB`);
                }
            }
        }
    } catch (error) {
        console.error('Erro ao inserir dados no MongoDB:', error);
    }
}

async function main() {
    const db = await connectToMongoDB();
    if (db) {
        await inserirDadosPorPasta(db, 'D:/novosCatsJson');
        // Insira mais pastas se necessário
    }
}

main();
