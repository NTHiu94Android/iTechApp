import CustomAxios from "../../helpers/Axiosinstance";


//---------------------------------Category---------------------------------
export const getCategories = async () => {
    const response = await CustomAxios().get('categories/api/get-all-category');
    return response;
}; 


//---------------------------------Brand---------------------------------
//Lay danh sanh thuong hieu theo idCategory
export const getBrandsByIdCategory = async (idCategory) => {
    const response = await CustomAxios().get(`brands/api/get-brand-by-id-category/${idCategory}`);
    return response;
};


//---------------------------------Product---------------------------------
//Lay tat ca san pham
export const getProducts = async () => {
    const response = await CustomAxios().get('/products/api/get-products');
    return response;
};

//---------------------------------Sub Product---------------------------------
//Lay tat ca sub san pham theo idProduct
export const getSubProductsByIdProduct = async (idProduct) => {
    const response = await CustomAxios().get(`sub-products/api/get-sub-products-by-id-product/${idProduct}`);
    return response;
};

//Lay tat ca subProducts
export const getSubProducts = async () => {
    const response = await CustomAxios().get('/sub-products/api/get-all-sub-products');
    return response;
};

//Cap nhat subProduct
export const updateSubProduct = async (_id, quantity) => {
    const response = await CustomAxios().post('/sub-products/api/update-sub-product', { _id, quantity });
    return response;
};

//---------------------------------Picture---------------------------------
//Lay tat ca picture theo idProduct
export const getPicturesByIdProduct = async (idSubProduct) => {
    const response = await CustomAxios().get(`/pictures/api/get-pictures-by-idSubProduct/${idSubProduct}`);
    return response;
};

//Lay tat ca picture 
export const getPictures = async () => {
    const response = await CustomAxios().get('/pictures/api/get-all-picture');
    return response;
};

//Them hinh anh
export const addPicture = async (url, idSubProduct, idReview) => {
    const response = await CustomAxios().post('/pictures/api/add-picture', { url, idSubProduct, idReview });
    return response;
}

//Upload hinh anh
export const uploadPicture = async (picture) => {
    const response = await CustomAxios('multipart/form-data').post('/pictures/api/upload-picture', picture);
    return response;
}
  

//---------------------------------OrderDetail---------------------------------
//Them san pham yeu thich / gio hang
export const addOrderDetail = async (quantity, price, idOrder, idSubProduct) => {
    const response = await CustomAxios().post(`/order-details/api/add-order-detail`, { quantity, price, idOrder, idSubProduct });
    return response;
};

//Lay danh sach san pham yeu thich/gio hang theo idOrder
export const getOrderDetailsByIdOrder = async(idOrder) => {
    const res = await CustomAxios().get(`/order-details/api/get-order-detail-by-idOrder/${idOrder}`);
    return res;
}

//Lay tat ca san pham yeu thich/gio hang
export const getOrderDetails = async() => {
    const res = await CustomAxios().get(`/order-details/api/get-all-order-detail`);
    return res;
};

//Xoa san pham yeu thich/gio hang
export const deleteOrderDetail = async(id) => {
    const res = await CustomAxios().get(`/order-details/api/delete-order-detail/${id}`);
    return res;
};

//Cap nhat san pham yeu thich/gio hang
export const updateOrderDetail = async(_id, quantity, price, isCmt, idOrder, idSubProduct) => {
    const data = {
        _id, quantity, price, isCmt, idOrder, idSubProduct
    }
    const res = await CustomAxios().post(`/order-details/api/update-order-detail`, data);
    return res;
};

//Cap nhat idOrder cua orderDetail
export const updateIdOrderOfOrderDetail = async(_id, idOrder) => {
    const data = {
        _id, idOrder
    }
    const res = await CustomAxios().post(`/order-details/api/update-order-detail-to-order`, data);
    return res;
};

//---------------------------------Order---------------------------------
//Them don hang
export const addOrder = async (dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser) => {
    const data = {
        dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser
    };
    const response = await CustomAxios().post(`/orders/api/add-order`, data);
    return response;
}

//Lay danh sach don hang theo idUser
export const getOrdersByIdUser = async(idUser) => {
    const res = await CustomAxios().get(`/orders/api/get-orders-by-idUser/${idUser}`);
    return res;
}

//Cap nhat don hang
export const updateOrder = async(_id, datePayment, status) => {
    const data = {
        _id, datePayment, status
    }
    const res = await CustomAxios().post(`/orders/api/update-order`, data);
    return res;
};

//---------------------------------Review---------------------------------
//Lay danh tat ca review
export const getReviews = async () => {
    const response = await CustomAxios().get('/reviews/api/get-all-review');
    return response;
};

//Them review moi
export const addReview = async (time, content, rating, idUser, idProduct) => {
    const data = {
        time, content, rating, idUser, idProduct
    }
    const res = await CustomAxios().post('/reviews/api/add-review', data);
    return res;
}


//---------------------------------Adderss---------------------------------
//Lay danh sach dia chi theo idUser
export const getAddressByIdUser = async(idUser) => {
    const res = await CustomAxios().get(`/address/api/get-address-by-idUser/${idUser}`);
    return res;
};

//Them dia chi
export const addAddress = async (body, status, numberPhone, idUser) => {
    const data = {
        body, status, numberPhone, idUser
    };
    const response = await CustomAxios().post(`/address/api/add-address`, data);
    return response;
}

//Cap nhat dia chi
export const updateAddress = async(_id, body, status, numberPhone, idUser) => {
    const data = {
        _id, body, status, numberPhone, idUser
    }
    const res = await CustomAxios().post(`/address/api/update-address`, data);
    return res;
};

//Xoa dia chi
export const deleteAddress = async(_id) => {
    const res = await CustomAxios().get(`/address/api/delete-address/${_id}`);
    return res;
};

//---------------------------------User---------------------------------
//Lay danh sach user
export const getUsers = async () => {
    const response = await CustomAxios().get('/users/api/get-all-user');
    return response;
};

//---------------------------------Promotion---------------------------------
//Lay danh sach khuyen mai
export const getPromotions = async (idUser) => {
    const response = await CustomAxios().get(`/promotions/api/get-all-promotion-by-id-user/${idUser}`);
    return response;
};

//Them khuyen mai
export const addPromotion = async (content, sale,  maxSale, code, dayStart, dayEnd, condition, idUser) => {
    const data = {
        content, sale, maxSale, code, dayStart, dayEnd, condition, idUser
    };
    const response = await CustomAxios().post(`/promotions/api/add-promotion`, data);
    return response;
};

//Cap nhat khuyen mai
export const updatePromotion = async (_id, isSubmit) => {
    const data = {
        _id, isSubmit
    };
    const response = await CustomAxios().post(`/promotions/api/update-promotion-submit`, data);
    return response;
};

//Xoa khuyen mai
export const deletePromotion = async (_id) => {
    const response = await CustomAxios().get(`/promotions/api/delete-promotion/${_id}`);
    return response;
};


//---------------------------------Notification---------------------------------
//Lay danh sach thong bao
export const getNotifications = async (idReceiver) => {
    const response = await CustomAxios().get(`/notifications/api/get-notification-by-idReceiver/${idReceiver}`);
    return response;
};

//Cap nhat thong bao
export const updateNotification = async (_id) => {
    const data = {
        _idNotification: _id
    };
    const response = await CustomAxios().post(`/notifications/api/update-notification-isCheck`, data);
    return response;
};

//Xoa thong bao
export const deleteNotification = async (_idNotification) => {
    const response = await CustomAxios().get(`/notifications/api/delete-notification/${_idNotification}`);
    return response;
};











