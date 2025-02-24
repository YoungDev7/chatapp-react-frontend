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
    const [token, setToken] = useState(); //default value is undefined which means we still havent fetched the token
    // TODO: research best place where to store token
    
    //fetch access token from the server 
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await api.get('/Auth');
                setToken(response.data.accessToken);
            }catch {
                setToken(null); //set token to null if token wasnt returned
            }
        };

        fetchToken();

    }, []);

    //this interceptor is adding access token to headers until the token is expired
    //useLayoutEffect because we want to block rest of the rendering down the component
    //tree to make sure they dont trigger requests without correct auth headers
    useLayoutEffect(() => {
        const interceptor = api.interceptors.request.use((config) => {
            if(!config._retry && token){
                config.headers.Authorization = `Bearer ${token}`;
            } //else config.headers.Authorization remains the same
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
            
            //TODO: this if is specific to backend response which needs to be implemented in this way
            if(error.response.status === 403 && error.response.data.message === "Unauthorized"  && !originalRequest._retry){
                
                originalRequest._retry = true; // Mark as retried before the attempt to prevent infinite loop
                
                //we send new request to the server to get new access token 
                try{
                    const response = await api.get('/refreshToken');
                    
                    setToken(response.data.accessToken);

                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

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
