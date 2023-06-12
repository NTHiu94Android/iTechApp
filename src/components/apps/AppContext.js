import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import {
  //Category & Brand
  getCategories, getBrandsByIdCategory,
  //Product, subProduct
  getProducts, getSubProductsByIdProduct, getSubProducts, updateSubProduct,
  //Picture
  getPicturesByIdProduct, getPictures, uploadPicture, addPicture,
  //Order
  addOrder, getOrdersByIdUser, updateOrder,
  //OrderDetail
  addOrderDetail, getOrderDetailsByIdOrder, deleteOrderDetail, updateOrderDetail, getOrderDetails,
  //Review
  getReviews, addReview,
  //Address
  getAddressByIdUser, addAddress, updateAddress, deleteAddress,
  //User
  getUsers,
  //Promotion
  getPromotions, addPromotion, updatePromotion, deletePromotion,

} from './AppService';
import { UserContext } from '../users/UserContext';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const { children } = props;
  const { user } = useContext(UserContext);
  const [listCart, setListCart] = useState([]);
  const [listFavorite, setListFavorite] = useState([]);

  const [countAddress, setCountAddress] = useState(0);
  const [countCart, setCountCart] = useState(0);
  const [countFavorite, setCountFavorite] = useState(0);
  const [countOrder, setCountOrder] = useState(0);
  const [countOrderDetail, setCountOrderDetail] = useState(0);

  // const objRef = useRef({});

  // useEffect(() => {
  //   const getDatas = async () => {
  //     //Lay danh sach san pham, sub san pham, hinh anh
  //     const resProducts = await onGetProducts();

  //     const resSubProducts = await onGetSubProducts();
  //     const resPictures = await onGetPictures();
  //     //Lay thuong hieu, danh muc
  //     const resCategories = await onGetCategories();
  //     const listCategories = resCategories.data;
  //     //Lay danh sach thuong hieu theo danh muc
  //     let listBrands = [];
  //     for(let i = 0; i < listCategories.length; i++) {
  //       const resBrands = await onGetBrandsByIdCategory(listCategories[i]._id);
  //       listBrands.push(resBrands.data);
  //     }

  //     objRef.current = {
  //       listProducts: resProducts,
  //       listSubProducts: resSubProducts,
  //       listPictures: resPictures,
  //       listCategories: resCategories,
  //       listBrands: listBrands,
  //     }
  //   };
  //   getDatas();
  // }, []);


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

  //Lay san pham theo name
  const onGetProductByName = async (name) => {
    try {
      const res = await getProducts();
      //Lay tat ca san pham co name chua name
      const listProduct = res.data.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
      return listProduct;
    } catch (error) {
      console.log('onGetProductByName error: ', error);
    }
  };

  //-------------------------------------------------Sub Product-------------------------------------------------
  //Lay tat ca subProducts
  const onGetSubProducts = async () => {
    try {
      const res = await getSubProducts();
      return res;
    } catch (error) {
      console.log('onGetSubProducts error: ', error);
    }
  };

  //Lay tat ca sub san pham theo idProduct
  const onGetSubProductsByIdProduct = async (idProduct) => {
    try {
      const res = await getSubProductsByIdProduct(idProduct);
      return res;
    } catch (error) {
      console.log('onGetSubProductsByIdProduct error: ', error);
    }
  };

  //Lay subProduct theo id
  const onGetSubProductById = async (idSubProduct) => {
    try {
      const res = await getSubProducts();
      const subProduct = res.data.find((item) => item._id === idSubProduct);
      return subProduct;
    } catch (error) {
      console.log('onGetSubProductById error: ', error);
    }
  };

  //Cap nhat so luong subProduct
  const onUpdateSubProduct = async (idSubProduct, quantity) => {
    try {
      const res = await updateSubProduct(idSubProduct, quantity);
      return res;
    } catch (error) {
      console.log('onUpdateSubProduct error: ', error);
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

  //Lay tat ca picture
  const onGetPictures = async () => {
    try {
      const res = await getPictures();
      return res;
    } catch (error) {
      console.log('onGetPictures error: ', error);
    }
  };

  //Lay hinh anh theo idReview
  const onGetPicturesByIdReview = async (idReview) => {
    try {
      const res = await onGetPictures();
      const listPictures = res.data.filter((item) => item.idReview === idReview);
      return listPictures;
    } catch (error) {
      console.log('onGetPicturesByIdReview error: ', error);
    }
  };

  //Them hinh anh moi
  const onAddPicture = async (url, idSubProduct, idReview) => {
    try {
      const res = await addPicture(url, idSubProduct, idReview);
      return res;
    } catch (error) {
      console.log('onAddPicture error: ', error);
    }
  }

  //Upload hinh anh
  const onUploadPicture = async (image) => {
    try {
      const response = await uploadPicture(image);
      if (response.data != null || response.data != undefined) {
        return response;
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  };

  //-------------------------------------------------OrderDetail-------------------------------------------------
  //Them san pham yeu thich / gio hang
  const onAddOrderDetail = async (quantity, price, idOrder, idSubProduct) => {
    try {
      if (idOrder === user.idFavorite) {
        const resOrderDetail = await onGetOrderDetailByIdOrder(idOrder);
        let check = false;
        if (resOrderDetail.data != undefined) {
          for (let i = 0; i < resOrderDetail.data.length; i++) {
            if (resOrderDetail.data[i].idSubProduct == idSubProduct) {
              check = true;
              onDeleteOrderDetail(resOrderDetail.data[i]._id);
              setCountFavorite(countFavorite + 1);
              break;
            }
          }
        }
        if (check == true) return false;
        await addOrderDetail(quantity, price, idOrder, idSubProduct);
        setCountFavorite(countFavorite + 1);
        return true;

      }
      if (idOrder === user.idCart) {
        const res = await onGetOrderDetailByIdOrder(idOrder);
        let check = false;
        let idOrderDetail = '';
        let quantityNow = 0;
        if (res.data != undefined) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].idSubProduct == idSubProduct) {
              check = true;
              idOrderDetail = res.data[i]._id;
              quantityNow = res.data[i].quantity;
              break;
            }
          }
        }
        if (check == true) {
          //Lay so luong san pham hien tai
          const resSubProduct = await onGetSubProductById(idSubProduct);
          const quantitySubProduct = resSubProduct.quantity;
          if(quantityNow + quantity > quantitySubProduct) {
            quantityNow = quantitySubProduct;
          }else{
            quantityNow = quantityNow + quantity;
          }
          //Cap nhat so luong san pham
          await onUpdateOrderDetail(idOrderDetail, quantityNow, price, false, idOrder, idSubProduct);
          setCountCart(countCart + 1);
          return;
        } 
        await addOrderDetail(quantity, price, idOrder, idSubProduct);
        setCountCart(countCart + 1);
        return true;
      }
    } catch (error) {
      console.log('onAddOrderDetail error: ', error);
    }
  };

  //Them tat ca san pham yeu thich vao gio hang
  const onAddAllFavoriteToCart = async (listFavorite) => {
    try {
      //Them tat ca san pham yeu thich vao gio hang
      //Lay danh sach hoa don chi tiet theo idCart
      const resOrderDetail = await onGetOrderDetailByIdOrder(user.idCart);

      //Duyen danh sach san pham yeu thich
      for (let i = 0; i < listFavorite.length; i++) {
        let check = false; 
        //neu danh sach hoa don chi tiet khong rong
        if (resOrderDetail.data != undefined) {
          //Duyen danh sach hoa don chi tiet theo idCart
          for (let j = 0; j < resOrderDetail.data.length; j++) {
            console.log('resOrderDetail.data[i].idSubProduct: ', resOrderDetail.data[j].idSubProduct);
            console.log('listFavorite[i].idSubProduct: ', listFavorite[i].idSubProduct);
            //Neu idSubProduct cua san pham yeu thich trung voi idSubProduct cua hoa san pham trong gio hang
            if (resOrderDetail.data[j].idSubProduct == listFavorite[i].idSubProduct) {
              check = true;
              break;
            }
          }
        }
        console.log('check: ', check);
        //Neu khong trung thi them san pham yeu thich vao gio hang va xoa san pham yeu thich
        if (check == false) {
          onDeleteOrderDetail(listFavorite[i]._id);
          await addOrderDetail(1, 0, user.idCart, listFavorite[i].idSubProduct);
        }else{
          onDeleteOrderDetail(listFavorite[i]._id);
        }
        
      }
      setCountFavorite(countFavorite + 10);
      setCountCart(countCart + 10);
      return true;
    } catch (error) {
      console.log('onAddAllFavoriteToCart error: ', error);
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

  //Lay danh sach order detail
  const onGetOrderDetails = async () => {
    try {
      const res = await getOrderDetails();
      return res;
    } catch (error) {
      console.log("onGetOrderDetails", error);
    }
  };


  //Xoa san pham yeu thich / gio hang
  const onDeleteOrderDetail = async (idOrderDetail) => {
    try {
      const res = await deleteOrderDetail(idOrderDetail);
      return res;
    } catch (error) {
      console.log('onDeleteOrderDetail error: ', error);
    }
  };

  //Cap nhat san pham yeu thich / gio hang
  const onUpdateOrderDetail = async (_id, quantity, price, isCmt, idOrder, idSubProduct) => {
    try {
      const res = await updateOrderDetail(_id, quantity, price, isCmt, idOrder, idSubProduct);
      return res;
    } catch (error) {
      console.log('onUpdateOrderDetail error: ', error);
    }
  };

  //-------------------------------------------------Order-------------------------------------------------
  //Them order
  const onAddOrder = async (dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser) => {
    try {
      const res = await addOrder(dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser);
      return res;
    } catch (error) {
      console.log('onAddOrder error: ', error);
    }
  };

  //Lay danh sach order by idUser
  const onGetOrdersByIdUser = async (idUser) => {
    try {
      const res = await getOrdersByIdUser(idUser);
      return res;
    } catch (error) {
      console.log('onGetOrdersByIdUser error: ', error);
    }
  };

  //Cap nhat order
  const onUpdateOrder = async (_id, datePayment, status) => {
    try {
      const res = await updateOrder(_id, datePayment, status);
      return res;
    } catch (error) {
      console.log('onUpdateOrder error: ', error);
    }
  };


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

  //Them review moi
  const onAddReview = async (time, content, rating, idUser, idProduct) => {
    try {
      const res = await addReview(time, content, rating, idUser, idProduct);
      return res;
    } catch (error) {
      console.log('onAddReview error: ', error);
    }
  }

  //-------------------------------------------------Address-------------------------------------------------
  //Them address
  const onAddAddress = async (body, status, idUser) => {
    try {
      const res = await addAddress(body, status, idUser);
      return res;
    } catch (error) {
      console.log('onAddAddress error: ', error);
    }
  };

  //Lay danh sach address by idUser
  const onGetAddressByIdUser = async (idUser) => {
    try {
      const res = await getAddressByIdUser(idUser);
      return res;
    } catch (error) {
      console.log('onGetAddressByIdUser error: ', error);
    }
  };

  //Cap nhat address
  const onUpdateAddress = async (idAddress, body, status, idUser) => {
    try {
      const res = await updateAddress(idAddress, body, status, idUser);
      return res;
    } catch (error) {
      console.log('onUpdateAddress error: ', error);
    }
  };

  //Xoa address
  const onDeleteAddress = async (idAddress) => {
    try {
      const res = await deleteAddress(idAddress);
      return res;
    } catch (error) {
      console.log('onDeleteAddress error: ', error);
    }
  };

  //-------------------------------------------------User-------------------------------------------------
  //Lay danh sach user
  const onGetUsers = async () => {
    try {
      const res = await getUsers();
      return res;
    } catch (error) {
      console.log('onGetUsers error: ', error);
    }
  };

  //-------------------------------------------------Promotion-------------------------------------------------
  //Lay danh sach promotion
  const onGetPromotions = async (idUser) => {
    try {
      const res = await getPromotions(idUser);
      return res;
    } catch (error) {
      console.log('onGetPromotions error: ', error);
    }
  };

  //Them promotion
  const onAddPromotion = async (content, sale, maxSale, code, dayStart, dayEnd, condition, idUser) => {
    try {
      const res = await addPromotion(content, sale, maxSale, code, dayStart, dayEnd, condition, idUser);
      return res;
    } catch (error) {
      console.log('onAddPromotion error: ', error);
    }
  };

  //Cap nhat promotion
  const onUpdatePromotion = async (_id, isSubmit) => {
    try {
      const res = await updatePromotion(_id, isSubmit);
      return res;
    } catch (error) {
      console.log('onUpdatePromotion error: ', error);
    }
  };

  //Xoa promotion
  const onDeletePromotion = async (_id) => {
    try {
      const res = await deletePromotion(_id);
      return res;
    } catch (error) {
      console.log('onDeletePromotion error: ', error);
    }
  };



  return (
    <AppContext.Provider value={{
      //Category & Brand
      onGetCategories, onGetBrandsByIdCategory,
      //Product
      onGetProducts, onGetProductById, onGetProductByName,
      //Sub Product
      onGetSubProductsByIdProduct, onGetSubProducts, onGetSubProductById, onUpdateSubProduct,
      //Reviews
      onGetReviews, onAddReview,
      //Picture
      onGetPicturesByIdProduct, onGetPictures, onUploadPicture, onAddPicture, onGetPicturesByIdReview,
      //OrderDetail
      onAddOrderDetail, onGetOrderDetailByIdOrder,
      onDeleteOrderDetail, onUpdateOrderDetail, onGetOrderDetails,
      onAddAllFavoriteToCart,
      //Order
      onAddOrder, onGetOrdersByIdUser, onUpdateOrder,
      //Address
      onAddAddress, onGetAddressByIdUser, onUpdateAddress, onDeleteAddress,
      //User
      onGetUsers,
      //Promotion
      onGetPromotions, onAddPromotion, onUpdatePromotion, onDeletePromotion,
      //State
      listFavorite, setListFavorite,
      listCart, setListCart,
      countCart, setCountCart,
      countFavorite, setCountFavorite,
      countAddress, setCountAddress,
      countOrder, setCountOrder,
      countOrderDetail, setCountOrderDetail,
      //Object reference
      // objRef,

    }}>
      {children}
    </AppContext.Provider>
  )
}
