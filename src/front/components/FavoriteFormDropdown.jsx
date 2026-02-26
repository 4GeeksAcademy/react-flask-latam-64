import React, { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

const FavoriteFormDropdown = () => {

  const { store, actions } = useGlobalReducer()
  const [favoriteType, setFavoriteType] = useState("")
  const [favoriteId, setFavoriteId] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    console.log({ favoriteId, favoriteType })
    const resp = await actions.addFavorite({ "type": favoriteType, "favorite_id": favoriteId })
    if (resp == null) {
      alert("No se pudo guardar")
      return
    }
    alert("Se guardo con exito el nuevo favorito")
  }

  return <div className="dropdown dropstart">
    <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
      Agregar favorito
    </button>
    <form onSubmit={handleSubmit} className="dropdown-menu p-4" style={{ width: "400px" }}>
      <div className="mb-3">
        <label htmlFor="exampleDropdownFormEmail2" className="form-label">Favorite type</label>
        <select value={favoriteType} onChange={(e) => setFavoriteType(e.target.value)} className="form-select" aria-label="Default select example">
          <option selected>Open this select menu</option>
          <option value="planet">Planet</option>
          <option value="people">People</option>
          <option value="film">Film</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleDropdownFormPassword2" className="form-label">Favorite Id</label>
        <input value={favoriteId} onChange={(e) => setFavoriteId(e.target.value)} type="number" className="form-control" placeholder="Favorite id" />
      </div>
      <button type="submit" className="btn btn-primary">Save</button>
    </form>
  </div>
}

export default FavoriteFormDropdown