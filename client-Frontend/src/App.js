import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
//import { FirebaseProvider } from './Components/config/Firebase';
import "./index.css";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Request from "./Pages/Request";
import BookLt from "./Pages/BookLt";
import { SnackbarProvider } from "./Components/SnackBar";
import axios from "axios";
import Home from "./Components/Home/Home";
import Logout from "./Components/Logout/Logout";
import ReqLogs from "./Components/RequestLog/ReqLogs";

const authAxios = axios.create({
  baseURL:process.env.REACT_APP_BACKEND_URL,
  withCredentials: true
})
authAxios.interceptors.request.use((request)=>{
  console.log(request)
  return request
},(error)=>{
  return Promise.reject(error)
})
function App() {
  
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated]=useState(false)
  const [isLoading, setIsLoading]=useState(true)
  const role=localStorage.getItem('role')
  
  const validateToken= async ()=>{
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    
    if (!backendURL) {
      console.error("REACT_APP_BACKEND_URL is not set!");
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }
    
    console.log("Validating token with backend:", backendURL);
    
    try{
      await axios.get(`${backendURL}/api/user`,{withCredentials:true}).then((resp)=>{
        if(resp.status===200){
          setIsAuthenticated(true)
          if(localStorage){
            localStorage.setItem('role',resp?.data.user.role)
            localStorage.setItem('id',resp?.data.user.userId)
            localStorage.setItem('email',resp?.data.user.email)
          }
        }
        setIsLoading(false)
      }).catch(function (err){
        console.error("Token validation error:", err);
        console.error("Error response:", err.response);
        setIsAuthenticated(false)
        setIsLoading(false)
        // Don't navigate here, let routes handle it
      })
    }
    catch(err){
      console.error("Token validation exception:", err);
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }

  useEffect( ()=>{
      validateToken()
  },[])
  if (isLoading) {
    return (
      <SnackbarProvider>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </SnackbarProvider>
    );
  }

  return (
    //<FirebaseProvider>
    <SnackbarProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout/>} />
          
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              {(role==='systemAdministrator' || role==='assistantRegistrar' || role==='facultyMentor') && 
                <Route path="/requests" element={<Request />} />}
              {role==='gsec' && role!=='guard' && 
                <Route path="/book" element={<BookLt />} />}
              {role==='gsec' && role!=='guard' && 
                <Route path="/reqLogs" element={<ReqLogs />} />}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
    </SnackbarProvider>
   // </FirebaseProvider>   

  )
}

export default App
