// import React from 'react'

import { useContext, useState } from "react";
import { Navigate, Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContex";
import axios from "axios";
import PalacesPage from "./PalacesPage";

const AccountPage = () => {
  const [redirect, setRedirect]= useState(null);
  const { user, ready,setUser,setReady} = useContext(UserContext);

  // console.log(user)
  if (!ready) {
    return 'Loading...';
}
  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />;
  } 
let {subpage} = useParams();
if(subpage===undefined){
  subpage='profile'
}

async function logout(){
  await axios.post('/logout');
  setRedirect('/');
  setUser(null)
}


// console.log(subpage);
function LinkClasses (type = null){
  let classes = 'py-2 px-6 inline-flex gap-1 rounded-full';
  if(type===subpage){
    classes += '  bg-primary text-while rounded-full'
  }
  else{
    classes+= ' bg-gray-200 '
  }
  return classes;

}
if(redirect){
  return <Navigate  to={redirect}/>
}



  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2">
        <Link className={LinkClasses('profile')} to={'/account/'}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

        My Profile</Link>
        <Link className={LinkClasses('booking')} to={'/account/booking'}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
</svg>

        My bookings</Link>
        <Link className={LinkClasses('places')} to={'/account/places'}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
</svg>

        My places</Link>
      </nav>
      {subpage=='profile' &&(
        <div className=" text-center max-w-lg mx-auto">
          
          logged in as {user.name} ({user.email})<br/>
          <button  onClick= {logout} className=" primary mx-w-sm mt-2 ">Logout</button>

        </div>
      )}
      {subpage==='places' && (
        <div>
          <PalacesPage/>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
