const axios = require("axios");

class NasaAPI {
    constructor() {
        this.BASE_URL = "https://api.nasa.gov/planetary/apod?api_key=JVFT4L57e63TkJldMITNXjbzobEEy77LYApW7l9I";
    }
    listNews() { 
        return axios.get(`${this.BASE_URL}&start_date=2023-01-01&end_date=2023-01-12`);
    }
    getNews(date) {
        return axios.get(`${this.BASE_URL}&date=${date}`);
    }
    /* deleteCharacter(id) {
        return axios.delete(`${this.BASE_URL}/${id}`);
    }
    createCharacter({name, occupation, debt, weapon}) {
        return axios.post(this.BASE_URL, {name, occupation, debt, weapon});
    } */
}

module.exports = new NasaAPI();