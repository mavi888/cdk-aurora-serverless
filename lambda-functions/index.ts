// lambda-function/index.ts
import createTodo from './createTodo';
import listTodos from './listTodos';
import getTodo from './getTodo';

exports.handler = async (event:any) => {
    console.log(event);

    switch (event.requestContext.http.method) {
        case 'POST': {
            console.log('POST')
            const task = JSON.parse(event.body);
            const todo =  await createTodo(task.task);
            return sendRes(200, JSON.stringify(todo))
        }

        case 'GET': {
            console.log('GET')

            if (event.queryStringParameters) {
                console.log('fetch one');
                const id = event.queryStringParameters.id
                console.log(id);
                const todo = await getTodo(id);
                return sendRes(200, JSON.stringify(todo));
            } else {
                console.log('list all')
                const todos = await listTodos();
                return sendRes(200, JSON.stringify(todos))
            }
        }
            
        default:
        return null;
    }
}

const sendRes = (status: number, body: string) => {
    var response = {
      statusCode: status,
      headers: {
        "Content-Type": "text/html",
      },
      body: body,
    };
    return response;
  };