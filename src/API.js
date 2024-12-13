import axios from 'axios';

const API = {
    readAll: async (path) => {
        let token;
        if (localStorage.getItem("token")) {
            token = localStorage.getItem("token");
        }

        const Authaxios = axios.create({
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'View-Type':'Admin'

            }
        })
        try {
            const response = await Authaxios.get(`${process.env.REACT_APP_BASE_URL}${path}`)
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },
    GetWithData: async (path, data) => {
        try {
            const response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_BASE_URL}${path}`,
                data: data
            });
            return response;
        } catch (err) {
            return err.response.data;
        }
    },
    read: async (path, id) => {
        let token;
        if (localStorage.getItem("token")) {
            token = localStorage.getItem("token");
        }
        const Authaxios = axios.create({
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'View-Type':'Admin'

            }
        })
        try {
            const response = await Authaxios.get(`${process.env.REACT_APP_BASE_URL}${path}/${id}`)
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },


    update: async (path, id, data) => {
        try {
            const token = localStorage.getItem('token');
            const authAxios = axios.create({
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'View-Type':'Admin'
                },
            })
            const response = await authAxios.patch(`${process.env.REACT_APP_BASE_URL}${path}/${id ? id : ""}`, data)
            return response.data;
        } catch (err) {
            console.log(err.response.data);
        }
    },

    create: async (path, data) => {
        try {
            const token = localStorage.getItem('token');
            const authAxios = axios.create({
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'View-Type':'Admin'
                },
            })
            const response = await authAxios.post(`${process.env.REACT_APP_BASE_URL}${path}`, data)
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },

    delete: async (path, id) => {
        try {
            const token = localStorage.getItem('token');
            const authAxios = axios.create({
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'View-Type':'Admin'
                },
            })
            const response = await authAxios.delete(`${process.env.REACT_APP_BASE_URL}${path}/${id}`)
            return response.data;
        } catch (err) {
            console.log(err.response.data);
        }
    },
}



export default API;