import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomAxios = (contentType = 'application/json') => {
    const axiosInstance = axios.create({
        baseURL: 'http://192.168.1.7:3000/' //172.20.10.6 //192.168.1.33 //192.168.56.61 //https://hoang-long-mobile-server-nth94.onrender.com
    });

    axiosInstance.interceptors.request.use(
        async (config) => {
            const token = await AsyncStorage.getItem('token');
            config.headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': contentType,
            }
            return config;
        }, err => Promise.reject(err)
    );

    axiosInstance.interceptors.response.use(
        res => res.data,
        err => Promise.reject(err)
    );

    return axiosInstance;
};

export default CustomAxios;