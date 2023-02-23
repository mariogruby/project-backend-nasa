// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

class NasaAPI {
    constructor() {
        this.BASE_URL = "https://api.nasa.gov/planetary/apod?api_key=JVFT4L57e63TkJldMITNXjbzobEEy77LYApW7l9I";
    }
    listNews() { 
        return axios.get(`${this.BASE_URL}&start_date=2023-01-01&end_date=2023-01-12`);
    }
}
const nasaService = new NasaAPI()

document.addEventListener("DOMContentLoaded", () => {
  console.log("project-backend-nasa JS imported successfully!");
  document.getElementById('boton').addEventListener('click',()=>{
    nasaService.listNews()
    .then(result => {
      let allNews = result.data;
      allNews.forEach(element => {
        let dios = document.querySelector(".card-title");
        console.log(dios)
      });
    })
  })
});
