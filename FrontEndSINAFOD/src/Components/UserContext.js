import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];

    const [user, setUser] = useState(storedUser);
    const [permissions, setPermissions] = useState(storedPermissions);

    const updateUser = (newUserData) => {
        setUser(newUserData);
        sessionStorage.setItem('user', JSON.stringify(newUserData));
    };

    const updatePermissions = (perms) => {
        setPermissions(perms);
        localStorage.setItem('permissions', JSON.stringify(perms));
    };

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, updateUser, permissions, setPermissions: updatePermissions }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
