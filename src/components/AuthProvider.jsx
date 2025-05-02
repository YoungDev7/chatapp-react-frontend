// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import api from '../services/Api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const authContext = useContext(AuthContext);
    
    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return authContext;
};

// eslint-disable-next-line react/prop-types
export default function AuthProvider({ children }) {
    const [token, setTokenState] = useState(() => {
        return localStorage.getItem('accessToken');
    });
    
    const setToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('accessToken', newToken);
            console.log("Token set to local storage" + newToken);
        } else {
            localStorage.removeItem('accessToken');
            console.log("remove token" + newToken);
        }
        setTokenState(newToken);
    };
    

    useEffect(() => {
        const validateToken = async () => {
            if(localStorage.getItem('accessToken')){
                const response = await api.get('/auth/validateToken');
                if(response.status !== 200 && response.data.message !== "valid"){
                    setToken(null); //set token to null if token is invalid
                    console.log("Token is invalid");
                    return;
                }   
            }else {
                setToken(null); //set token to null if token is not present
            }
        };

        validateToken();
    }, []);

    //this interceptor is adding access token to headers until the token is expired
    //useLayoutEffect because we want to block rest of the rendering down the component
    //tree to make sure they dont trigger requests without correct auth headers
    useLayoutEffect(() => {
        const interceptor = api.interceptors.request.use((config) => {
            if(!config._retry && !config.skipAuthInterceptor && token){
                config.headers.Authorization = `Bearer ${token}`;
            } //else config.headers.Authorization remains the same
            console.log("Interceptor added");
            return config;
        });
        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [token]);

    //this interceptor is checking if response from the server is that access token is expired 
    //reference: flowchart_error_handling.png in doc
    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use((response) => response, async (error) => {
            const originalRequest = error.config;
            
            if(error.response.status === 401 && error.response.data.message === "Invalid token EXPIRED"  && !originalRequest._retry){
                
                originalRequest._retry = true; // Mark as retried before the attempt to prevent infinite loop
                
                //we send new request to the server to get new access token 
                try{
                    const response = await api.get('/auth/refresh');
                    
                    setToken(response.data.access_token);

                    originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

                    //if successful then we retry the original request
                    return api(originalRequest);
                }catch (refreshError){
                    setToken(null);
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        });
        return () => {
            api.interceptors.response.eject(refreshInterceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
  )
}
