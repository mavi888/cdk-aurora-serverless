// lambda-fns/getTodo.ts
import db from './db';

async function getTodo(id: string) {
    console.log('getTodo')
    try {
        const query  = `SELECT * FROM todos WHERE id = :id`;
        const results = await db.query(query, { id });
        return results.records[0];
    } catch (err) {
        console.log('Postgres error: ', err);
        return null;
    }
}

export default getTodo;