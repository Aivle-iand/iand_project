import axios from "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";

async function getIpClient() {
    try {
        const response = await axios.get("/get_client_ip/");
        const { ip, country } = response.data;
        console.log(ip, country);
    } catch (error) {
        console.error(error);
    }
}
