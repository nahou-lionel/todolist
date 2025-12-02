import { API_CONFIG } from "./config";

const RealAPIService = {
  // Helper GraphQL
  graphqlRequest: async (query, variables = {}, token = null) => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["authorization"] = "Bearer " + token;
    }

    const response = await fetch(API_CONFIG.REAL_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const jsonResponse = await response.json();

    if (jsonResponse.errors != null) {
      throw jsonResponse.errors[0];
    }

    return jsonResponse.data;
  },

  // Authentication
  signIn: async (username, password) => {
    const query = `
      mutation SignIn($username: String!, $password: String!) {
        signIn(username: $username, password: $password)
      }
    `;
    const data = await RealAPIService.graphqlRequest(query, {
      username,
      password,
    });
    return data.signIn;
  },

  signUp: async (username, password) => {
    const query = `
      mutation SignUp($username: String!, $password: String!) {
        signUp(username: $username, password: $password)
      }
    `;
    const data = await RealAPIService.graphqlRequest(query, {
      username,
      password,
    });
    return data.signUp;
  },

  deleteAccount: async (token, username) => {
    const query = `
      mutation DeleteUsers($where: UserWhere) {
        deleteUsers(where: $where) {
          nodesDeleted
          relationshipsDeleted
        }
      }
    `;
    const variables = {
      where: {
        username: username,
      },
    };
    const data = await RealAPIService.graphqlRequest(query, variables, token);
    return data.deleteUsers;
  },

  // TodoList operations
  getTodoLists: async (token, username) => {
    const query = `
      query TodoLists($where: TodoListWhere) {
        todoLists(where: $where) {
          id
          title
        }
      }
    `;
    const variables = {
      where: {
        owner: {
          username: username,
        },
      },
    };
    const data = await RealAPIService.graphqlRequest(query, variables, token);
    return data.todoLists;
  },

  createTodoList: async (token, username, title) => {
    const query = `
      mutation createTodoLists($input: [TodoListCreateInput!]!) {
        createTodoLists(input: $input) {
          todoLists {
            id
            owner {
              username
            }
            title
          }
        }
      }
    `;
    const variables = {
      input: [
        {
          owner: {
            connect: {
              where: {
                username: username,
              },
            },
          },
          title: title,
        },
      ],
    };
    const data = await RealAPIService.graphqlRequest(query, variables, token);
    const newList = data.createTodoLists.todoLists[0];
    // Ajouter les stats pour une nouvelle liste vide
    return {
      ...newList,
      totalTodos: 0,
      completedTodos: 0,
      completionPercentage: 0,
    };
  },

  updateTodoList: async (token, todoListId, title) => {
    const query = `
      mutation UpdateTodoList($id: ID!, $title: String!) {
        updateTodoLists(where: { id: $id }, update: { title: $title }) {
          todoLists {
            id
            title
            owner {
              id
              username
              roles
            }
          }
        }
      }
    `;
    const data = await RealAPIService.graphqlRequest(
      query,
      { id: todoListId, title },
      token
    );
    return data.updateTodoLists;
  },

  deleteTodoList: async (token, todoListId) => {
    const query = `
      mutation DeleteTodoLists($where: TodoListWhere) {
        deleteTodoLists(where: $where) {
          nodesDeleted
        }
      }
    `;
    const variables = {
      where: {
        id: todoListId,
      },
    };
    const data = await RealAPIService.graphqlRequest(query, variables, token);
    return data.deleteTodoLists.nodesDeleted;
  },

  // Todo operations
  getTodos: async (token, todoListId) => {
    const query = `
      query Todos($where: TodoWhere) {
        todos(where: $where) {
          id
          content
          done
        }
      }
    `;
    const variables = {
      where: {
        belongsTo: {
          id: todoListId,
        },
      },
    };
    const data = await RealAPIService.graphqlRequest(query, variables, token);
    return data.todos;
  },

  createTodo: async (token, todoListId, content, done = false) => {
    const query = `
      mutation CreateTodos($input: [TodoCreateInput!]!) {
        createTodos(input: $input) {
          todos {
            id
            content
            done
          }
        }
      }
    `;
    const variables = {
      input: [
        {
          belongsTo: {
            connect: {
              where: {
                id: todoListId,
              },
            },
          },
          content: content,
        },
      ],
    };
    const data = await RealAPIService.graphqlRequest(query, variables, token);
    return data.createTodos.todos[0];
  },

  updateTodo: async (token, todoId, updates) => {
    const query = `
      mutation UpdateTodos($where: TodoWhere, $update: TodoUpdateInput) {
        updateTodos(where: $where, update: $update) {
          todos {
            id
            content
            done
          }
        }
      }
    `;
    const variables = {
      where: {
        id: todoId,
      },
      update: updates,
    };
    const data = await RealAPIService.graphqlRequest(query, variables, token);
    return data.updateTodos.todos[0];
  },

  deleteTodo: async (token, todoId) => {
    const query = `
      mutation($id: ID!) {
        deleteTodos(where: { id: $id }) {
          nodesDeleted
        }
      }
    `;
    const variables = {
      id: todoId,
    };
    const data = await RealAPIService.graphqlRequest(query, variables, token);
    return data.deleteTodos.nodesDeleted;
  },
};

// Export the appropriate service based on configuration
export const API = RealAPIService;

// Export individual functions for convenience
export const {
  signIn,
  signUp,
  deleteAccount,
  getTodoLists,
  createTodoList,
  updateTodoList,
  deleteTodoList,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = API;
