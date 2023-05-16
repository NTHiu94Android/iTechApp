import React, { createContext, useContext, useState } from 'react'
import {
  //Category & Brand
  getCategories, getBrandsByIdCategory,
  //Product, subProduct
  getProducts, getSubProductsByIdProduct, getSubProducts,
  //Picture
  getPicturesByIdProduct,
  //Cart

  //Favorite

  //OrderDetail
  addOrderDetail, getOrderDetailsByIdOrder,

  //Review
  getReviews,

} from './AppService';
import { UserContext } from '../users/UserContext';
//import { UserContext } from '../users/UserContext';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const { children } = props;
  const { user } = useContext(UserContext);
  const [listCart, setListCart] = useState([]);
  const [listFavorite, setListFavorite] = useState([]);

  const [countCart, setCountCart] = useState(0);
  const [countFavorite, setCountFavorite] = useState(0);


  //-------------------------------------------------Category & Brand-------------------------------------------------
  const onGetCategories = async () => {
    try {
      const res = await getCategories();
      return res;
    } catch (error) {
      console.log('onGetCategories error: ', error);
    }
  };

  const onGetBrandsByIdCategory = async (idCategory) => {
    try {
      const res = await getBrandsByIdCategory(idCategory);
      return res;
    } catch (error) {
      console.log('onGetBrandsByIdCategory error: ', error);
    }
  };

  //-------------------------------------------------Product-------------------------------------------------
  //Lay tat ca san pham
  const onGetProducts = async () => {
    try {
      const res = await getProducts();
      return res;
    } catch (error) {
      console.log('onGetProducts error: ', error);
    }
  };

  //Lay san pham theo id
  const onGetProductById = async (idProduct) => {
    try {
      const res = await getProducts();
      const product = res.data.find((item) => item._id === idProduct);
      return product;
    } catch (error) {
      console.log('onGetProductById error: ', error);
    }
  };

  //-------------------------------------------------Sub Product-------------------------------------------------
  //Lay tat ca sub san pham theo idProduct
  const onGetSubProductsByIdProduct = async (idProduct) => {
    try {
      const res = await getSubProductsByIdProduct(idProduct);
      return res;
    } catch (error) {
      console.log('onGetSubProductsByIdProduct error: ', error);
    }
  };

  //Lay tat ca subProducts
  const onGetSubProducts = async () => {
    try {
      const res = await getSubProducts();
      return res;
    } catch (error) {
      console.log('onGetSubProducts error: ', error);
    }
  };

  //-------------------------------------------------Picture-------------------------------------------------
  //Lay tat ca picture theo idProduct
  const onGetPicturesByIdProduct = async (idSubProduct) => {
    try {
      const res = await getPicturesByIdProduct(idSubProduct);
      return res;
    } catch (error) {
      console.log('onGetPicturesByIdProduct error: ', error);
    }
  };

  //-------------------------------------------------OrderDetail-------------------------------------------------
  //Them san pham yeu thich / gio hang
  const onAddOrderDetail = async (quantity, idOrder, idProduct) => {
    try {
      if (idOrder === user.idFavorite) {
        const resOrderDetail = await onGetOrderDetailByIdOrder(idOrder);
        let check = false;
        if(resOrderDetail.data != undefined){
          for (let i = 0; i < resOrderDetail.data.length; i++) {
            if(resOrderDetail.data[i].idProduct == idProduct){
              check = true;
            }
          }
        }
        console.log("Check: ", check);
        if(check == true) return false;
        await addOrderDetail(quantity, idOrder, idProduct);
        setCountFavorite(countFavorite+1);
        return true;

      }
      if (idOrder === user.idCart) {
        const res = await addOrderDetail(quantity, idOrder, idProduct);
        setCountCart(countCart+1);
        return res;
      }
    } catch (error) {
      console.log('onAddOrderDetail error: ', error);
    }
  };

  //Lay danh sach order detail by idOrder
  const onGetOrderDetailByIdOrder = async (idOrder) => {
    try {
      const res = await getOrderDetailsByIdOrder(idOrder);
      return res;
    } catch (error) {
      console.log("onGetOrderDetailByIdOrder", error); 
    }
  }

  //-------------------------------------------------Cart-------------------------------------------------


  //-------------------------------------------------Favorite-------------------------------------------------
  //Lay san pham yeu thich theo idOrder


  //-------------------------------------------------Review-------------------------------------------------
  //Lay danh tat ca review
  const onGetReviews = async () => {
    try {
      const res = await getReviews();
      return res;
    } catch (error) {
      console.log('onGetReviews error: ', error);
    }
  };

  return (
    <AppContext.Provider value={{
      //Category & Brand
      onGetCategories, onGetBrandsByIdCategory,
      //Product
      onGetProducts, onGetProductById, onGetSubProductsByIdProduct, onGetSubProducts,
      //Reviews
      onGetReviews,
      //Picture
      onGetPicturesByIdProduct,
      //OrderDetail
      onAddOrderDetail, onGetOrderDetailByIdOrder,
      //State
      listFavorite, setListFavorite,
      countCart, setCountCart, 
      countFavorite, setCountFavorite,
    }}>
      {children}
    </AppContext.Provider>
  )
}
