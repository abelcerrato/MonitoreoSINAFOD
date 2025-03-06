import React, { createContext, useState, useContext, useEffect } from 'react';

// Creamos el contexto para el usuario
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  // Recuperamos el usuario del localStorage si existe
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(storedUser); // Estado para el usuario

  // Cada vez que el estado 'user' cambie, lo guardamos en el localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user'); // Si el usuario se desconecta, lo eliminamos del localStorage
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto en cualquier parte de la app
export const useUser = () => {
  return useContext(UserContext);
};
