/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [token, setTokenState] = useState(() => {
        return localStorage.getItem('accessToken');
    });
    
    const setToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('accessToken', newToken);
        } else {
            localStorage.removeItem('accessToken');
        }
        setTokenState(newToken);
    };
    


    //this interceptor is adding access token to headers until the token is expired
    //useLayoutEffect because we want to block rest of the rendering down the component
    //tree to make sure they dont trigger requests without correct auth headers
    useLayoutEffect(() => {
        const interceptor = api.interceptors.request.use((config) => {
            if(!config._retry && !config.skipAuthInterceptor && token){
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

        //DEBUG, expired token
        //setToken("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaWtlaG9ja0BlbWFpbC5jb20iLCJpYXQiOjE3NDQ3MTM5MDEsImV4cCI6MTc0NDcxNzUwMX0.zbCOJeHEFNNNEsvxKkA7w_AxpZ0en1yeSu4LmH5ysdA");

        const validateToken = async () => {
            try{
                if(localStorage.getItem('accessToken')){
                    const response = await api.get('/auth/validateToken');
                    if(response.status !== 200 && response.data.message !== "valid"){
                        setToken(null); //set token to null if token is invalid
                        console.error("Token is invalid");
                        return;
                    }   
                }else {
                    setToken(null); //set token to null if token is not present
                }
            }catch (error){
                console.error("Error validating token", error);
                setToken(null); //set token to null if token is not present
            }
        };

        // Small delay to ensure interceptor is set up first (next event loop)
        setTimeout(() => {
            validateToken();
        }, 0);

        const refreshInterceptor = api.interceptors.response.use((response) => response, async (error) => {
            console.debug("error response", error.response);
            if(error.response.status === 401){
                console.debug("status is 401");
            }
            if(error.response.data === "Invalid token EXPIRED"){
                console.debug("token is expired");
            }


            const originalRequest = error.config;

            if(!originalRequest._retry){
                console.debug("originalRequest is not retried");
            }
            
            

            //TODO: specific server replies should be stored in file as local variables or something like that 
            if(error.response.status === 401 && error.response.data === "Invalid token EXPIRED"  && !originalRequest._retry){
                
                console.debug("Token expired, refreshing token");
                originalRequest._retry = true; // Mark as retried before the attempt to prevent infinite loop
                
                //we send new request to the server to get new access token 
                try{
                    const response = await api.post('/auth/refresh', {
                        withCredentials: true // Ensures refresh cookie is sent
                    });
                    
                    setToken(response.data.access_token);
                    navigate('/');

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
