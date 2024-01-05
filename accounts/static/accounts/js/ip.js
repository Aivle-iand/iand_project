import axios from "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"

async function getIpClient() {
    try {
        const response = await axios.get('/get_client_ip/');  // URL 변경에 주의
        const { ip, country } = response.data;
        console.log(ip, country);

        // 이제 이 정보를 사용하여 로그인 폼을 제출하면 됩니다.
    } catch (error) {
        console.error(error);
    }
}