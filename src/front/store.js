const apiUrl =
  import.meta.env.VITE_BACKEND_URL

export const initialStore = () => {
  return {
    message: null,
    todos: [{
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    token: null,
    fullUserName: null,
    favorites: []
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
    case 'add_task':
      const {
        id, color
      } = action.payload
      let newTodos = store.todos.map((todo) => (todo.id === id ? {
        ...todo,
        background: color
      } : todo))
      return {
        ...store,
        todos: newTodos
      };
    case 'set_favorites':
      return {
        ...store, favorites: action.payload
      }
      case 'load_token':
        return {
          ...store,
          token: action.payload
        }
        case 'load_user_info':
          return {
            ...store,
            userFullName: action.payload.userFullName,
              favorites: action.payload.favorites
          }
          default:
            throw Error('Unknown action.');
  }
}

export class Actions {
  constructor(dispatch, store) {
    this.dispatch = dispatch
    this.store = store
  }

  async login(username, password) {
    const resp = await fetch(apiUrl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    if (!resp.ok) {
      let errroInfo = await resp.json()
      return {
        error: errroInfo.error
      }
    }

    let data = await resp.json()
    localStorage.setItem("token", data.token)
    this.loadToken()
    await this.loadUserInfo()
    return {
      message: data.message
    }
  }

  loadToken() {
    const token = localStorage.getItem("token")
    if (token) {
      this.dispatch({
        type: "load_token",
        payload: token
      })
    }
  }

  async loadUserInfo() {
    const token = this.store.token
    if (!token) {
      console.error("No token")
      return
    }
    const resp = await fetch(apiUrl + "/user/", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    if (!resp.ok) {
      alert("Error al establecer el usuario:\n" + resp.statusText)
      this.dispatch({
        type: "load_token",
        payload: null
      })
      localStorage.removeItem("token")
      return
    }
    const data_json = await resp.json()
    this.dispatch({
      type: "load_user_info",
      payload: {
        userFullName: data_json.fullName,
        favorites: data_json.favorites
      }
    })
  }

  async addFavorite(newFavorite) {
    const token = this.store.token
    if (!token) {
      console.error("No token")
      return
    }
    const resp = await fetch(apiUrl + "/favorites/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(newFavorite)
    })
    if (!resp.ok) {
      alert("Error al guardar favorito:\n" + resp.statusText)
      return null
    }
    const data_json = await resp.json()
    const newFavorites = [...this.store.favorites, data_json.data]
    this.dispatch({
      type: "set_favorites",
      payload: newFavorites
    })
    return data_json.data
  }

  async logout() {
    const token = this.store.token
    if (!token) {
      console.error("No token")
      return
    }
    const resp = await fetch(apiUrl + "/logout", {
      headers: {
        "Authorization": "Bearer " + token
      },
      method: "POST"
    })
    if (!resp.ok) {
      alert("Error al cerrar session:\n" + resp.statusText)
      return
    }
    this.dispatch({
      type: "load_token",
      payload: null
    })
    localStorage.removeItem("token")
  }


}