import React, { createContext, useContext, useState } from 'react'
import {
  //Category & Brand
  
  //Product
  
  //Picture
  
  //Cart

  //Favorite
  
} from './AppService';
//import { UserContext } from '../users/UserContext';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const { children } = props;



  //-------------------------------------------------Product-------------------------------------------------



  //-------------------------------------------------Picture-------------------------------------------------


  //-------------------------------------------------OrderDetail-------------------------------------------------


  //-------------------------------------------------Cart-------------------------------------------------
  

  //-------------------------------------------------Favorite-------------------------------------------------
  //Lay san pham yeu thich theo idOrder


  return (
    <AppContext.Provider value={{ }}>
      {children}
    </AppContext.Provider>
  )
}
