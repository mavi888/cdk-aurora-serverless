// lambda-fns/createPost.ts
import Todo from './Todo';
import db from './db';
const { v4: uuid } = require('uuid');

async function createTodo(task : string) {
    console.log('create Todo')
    const todo: Todo = {
        id: uuid(),
        tasks: task
    };
    
    const { id, tasks } = todo;
    try {
        const query = `INSERT INTO todos (id,tasks) VALUES(:id,:tasks)`;
        await db.query(query, { id, tasks });
        return todo;
    } catch (err) {
        console.log('Postgres error: ', err);
        return null;
    }
}

export default createTodo;