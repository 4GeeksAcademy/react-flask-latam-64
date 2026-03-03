const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
    token: null,
    fullUserName: null,
    favorites: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };
    case "add_task":
      const { id, color } = action.payload;
      let newTodos = store.todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              background: color,
            }
          : todo,
      );
      return {
        ...store,
        todos: newTodos,
      };
    case "set_favorites":
      return {
        ...store,
        favorites: action.payload,
      };
    case "load_token":
      return {
        ...store,
        token: action.payload,
      };
    case "load_user_info":
      return {
        ...store,
        userFullName: action.payload.userFullName,
        favorites: action.payload.favorites,
      };
    default:
      throw Error("Unknown action.");
  }
}

export class Actions {
  constructor(dispatch, store) {
    this.dispatch = dispatch;
    this.store = store;
  }

  async apiFetch(endpoint, method = "GET", body = null, isPrivate = true) {
    const token = this.store.token;
    if (!token && isPrivate) {
      console.error("No token");
      return;
    }
    const fetchParams = { method, headers: {} };
    if (body) {
      fetchParams.body = JSON.stringify(body);
      fetchParams.headers["Content-Type"] = "application/json";
    }
    if (isPrivate) {
      fetchParams.headers["Authorization"] = "Bearer " + token;
    }

    try {
      const resp = await fetch(apiUrl + endpoint, fetchParams);
      let data = await resp.json();
      return { code: resp.status, ok: resp.ok, data };
    } catch (error) {
      return { code: 0, ok: false, error: error.message, data: null };
    }
  }

  async login(username, password) {
    const resp = await this.apiFetch(
      "/login",
      "POST",
      { username, password },
      false,
    );
    if (!resp.ok) {
      return {
        error: resp.data.error,
      };
    }
    localStorage.setItem("token", resp.data.token);
    this.loadToken();
    await this.loadUserInfo();
    return {
      message: resp.data.message,
    };
  }

  loadToken() {
    const token = localStorage.getItem("token");
    if (token) {
      this.dispatch({
        type: "load_token",
        payload: token,
      });
    }
  }

  async loadUserInfo() {
    const resp = await this.apiFetch("/user");
    if (!resp.ok) {
      alert("Error al establecer el usuario:\n" + resp.error);
      this.dispatch({
        type: "load_token",
        payload: null,
      });
      localStorage.removeItem("token");
      return;
    }

    this.dispatch({
      type: "load_user_info",
      payload: {
        userFullName: resp.data.fullName,
        favorites: resp.data.favorites,
      },
    });
  }

  async addFavorite(newFavorite) {
    /*   const token = this.store.token;
    if (!token) {
      console.error("No token");
      return;
    }
    const resp = await fetch(apiUrl + "/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newFavorite),
    }); */
    const resp = await this.apiFetch("/favorites", "POST", newFavorite);
    if (!resp.ok) {
      alert("Error al guardar favorito:\n");
      return null;
    }
    const data_json = resp.data;
    const newFavorites = [...this.store.favorites, data_json.data];
    this.dispatch({
      type: "set_favorites",
      payload: newFavorites,
    });
    return data_json.data;
  }

  async logout() {
    const resp = await this.apiFetch("/logout", "POST");
    if (!resp.ok) {
      alert("Error al cerrar session:\n" + resp.statusText);
      return;
    }
    this.dispatch({
      type: "load_token",
      payload: null,
    });
    localStorage.removeItem("token");
  }

  async registerUser(user) {
    const resp = await this.apiFetch("/user", "POST", user, false);
    if (!resp.ok) {
      return { error: resp.error };
    }
    return { message: "ok" };
  }
}
