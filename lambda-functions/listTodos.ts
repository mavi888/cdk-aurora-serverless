// lambda-fns/listTodos.ts
import db from './db';

async function listTodos() {
    console.log('list todos')
    try {
        const result = await db.query(`SELECT * FROM todos`);
        return result.records;
    } catch (err) {
        console.log('Postgres error: ', err);
        return null;
    }
}

export default listTodos;