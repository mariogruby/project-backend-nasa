const axios = require("axios");

class NasaAPI {
    constructor() {
        this.BASE_URL = process.env.API_URL;
    }
    listNews() { 
        return axios.get(`${this.BASE_URL}&start_date=2025-06-30`);
    }
    getNews(date) {
        return axios.get(`${this.BASE_URL}&date=${date}`);
    }
   
}

module.exports = new NasaAPI();