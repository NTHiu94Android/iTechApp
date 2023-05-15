import CustomAxios from "../../helpers/Axiosinstance";

//get user by id
export const get_user_by_id = async (id) => {
    const response = await CustomAxios().get('us/api/get-user-by-id/' + id);
    return response;
}

export const login = async (email, password, tokenFcm) => {
    const body = {
        email: email,
        password: password,
        fcmToken: tokenFcm
    }
    const response = await CustomAxios().post('users/api/login', body);
    return response;
}

export const updateFcmToken = async (_id, tokenFcm) => {
    const body = {
        id: _id,
        fcmToken: tokenFcm
    }
    const response = await CustomAxios().post('users/api/update-fcm-token', body);
    return response;
};

export const register = async (email, password, name, birthday, address, numberPhone, avatar) => {
    const body = {
        email: email,
        password: password,
        name: name,
        address: address,
        birthday: birthday,
        numberPhone: numberPhone,
        avatar: avatar
    }
    const response = await CustomAxios().post('users/api/register', body);
    return response;
};

//Cap nhat thong tin ca nhan
export const update_profile = async (id, email, name, birthday, address, numberPhone, avatar) => {
    const body = {
        id: id,
        name: name,
        birthday: birthday,
        address: address,
        numberPhone: numberPhone,
        avatar: avatar,
        email: email
    };
    const response = await CustomAxios().post('users/api/update-profile', body);
    return response;
}

//Doi mat khau
export const change_password = async (id, new_password, confirm_password) => {
    const body = {
        id: id,
        new_password: new_password,
        confirm_password: confirm_password,
    }
    const response = await CustomAxios().post('users/api/change-password', body);
    return response;
};

//forgot password
export const forgot_password = async (email) => {
    const body = {
        email: email,
    }
    const response = await CustomAxios().post('users/api/forgot-password', body);
    return response;
}

//reset password
export const reset_password = async (token, password, confirm_password) => {
    const body = {
        token: token,
        password: password,
        confirm_password: confirm_password,
    }
    const response = await CustomAxios().post('users/api/reset-password', body);
    return response;
};








