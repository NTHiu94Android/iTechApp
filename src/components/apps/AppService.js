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

//---------------------------------Picture---------------------------------
//Lay tat ca picture theo idProduct
export const getPicturesByIdProduct = async (idSubProduct) => {
    const response = await CustomAxios().get(`/pictures/api/get-pictures-by-idSubProduct/${idSubProduct}`);
    return response;
};
  

//---------------------------------OrderDetail---------------------------------
//Them san pham yeu thich / gio hang
export const addOrderDetail = async (quantity, idOrder, idSubProduct) => {
    const response = await CustomAxios().post(`/order-details/api/add-order-detail`, { quantity, idOrder, idSubProduct });
    return response;
};

//Lay danh sach san pham yeu thich/gio hang
export const getOrderDetailsByIdOrder = async(idOrder) => {
    const res = await CustomAxios().get(`/order-details/api/get-order-detail-by-idOrder/${idOrder}`);
    return res;
}

//Xoa san pham yeu thich/gio hang
export const deleteOrderDetail = async(id) => {
    const res = await CustomAxios().get(`/order-details/api/delete-order-detail/${id}`);
    return res;
};

//Cap nhat san pham yeu thich/gio hang
export const updateOrderDetail = async(_id, quantity, idOrder, idSubProduct) => {
    const data = {
        _id, quantity, idOrder, idSubProduct
    }
    const res = await CustomAxios().post(`/order-details/api/update-order-detail`, data);
    return res;
};

//---------------------------------Order---------------------------------
//Them don hang
export const addOrder = async (dateCreate, totalPrice, status, paymentMethod, address, idUser) => {
    const data = {
        dateCreate, totalPrice, status, paymentMethod, address, idUser
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
export const updateOrder = async(_id, dateCreate, totalPrice, status, paymentMethod, address, idUser) => {
    const data = {
        _id, dateCreate, totalPrice, status, paymentMethod, address, idUser
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












