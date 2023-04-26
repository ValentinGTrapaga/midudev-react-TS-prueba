import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { User } from './types.d'

function App() {
  const BASE_URL = 'https://randomuser.me/api/?results=100'
  const [users, setUsers] = useState<User[]>([])
  const [showColor, setShowColor] = useState<boolean>(false)
  const [sortByCountry, setSortByCountry] = useState<boolean>(false)
  const [filterByCountry, setFilterByCountry] = useState<string>('')
  const originalArray = useRef<User[]>([])

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const { results } = data
        setUsers(results)
        originalArray.current = results
      })
  }, [])

  const toggleColor = () => {
    setShowColor((prevState) => !prevState)
  }

  const toggleSortByCountry = () => {
    setSortByCountry((prevState) => !prevState)
  }

  const deleteUser = (userID: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== userID)
    setUsers(filteredUsers)
  }

  const resetTable = () => {
    setUsers(originalArray.current)
    setFilterByCountry('')
  }

  const filteredUsers = useMemo(() => {
    console.log('Rendering filteredUsers')
    return filterByCountry.length > 0 && typeof filterByCountry === 'string'
      ? [...users].filter((user) =>
          user.location.country
            .toLowerCase()
            .includes(filterByCountry.toLowerCase())
        )
      : users
  }, [users, filterByCountry])

  const sortedUsers = useMemo(() => {
    console.log('Rendering sortedUsers')
    return sortByCountry
      ? [...filteredUsers].sort((a, b) =>
          a.location.country.localeCompare(b.location.country)
        )
      : filteredUsers
  }, [filteredUsers, sortByCountry])

  return (
    <>
      <h1>Prueba tecnica React + Typescript</h1>
      <main>
        <header>
          <button onClick={toggleColor}>Colorear filas</button>
          <button onClick={toggleSortByCountry}>Ordenar por pais</button>
          <button onClick={resetTable}>Reiniciar tabla</button>
          <input
            value={filterByCountry}
            placeholder='Filtra por pais'
            onChange={(e) => setFilterByCountry(e.target.value)}
          />
        </header>
        {users.length > 0 && (
          <UsersList
            showColor={showColor}
            deleteUser={deleteUser}
            users={sortedUsers}
          />
        )}
      </main>
    </>
  )
}

export default App
