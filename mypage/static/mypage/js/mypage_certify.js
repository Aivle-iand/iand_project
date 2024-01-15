const updateButton = (event) => {
    const btn = document.getElementsByClassName("submit_btn");
    const svg = document.getElementsByClassName("submit_img");
    if (event.target.value) {
        btn[0].setAttribute("class", "submit_btn activate");
        svg[0].setAttribute("class", "submit_img activate");
        btn[0].disabled = false;
    } else {
        btn[0].setAttribute("class", "submit_btn");
        svg[0].setAttribute("class", "submit_img");
    }
};

function submitPinButton() {
    const cur_pinpwd_input = document.getElementById("cur-pinpwd");
    cur_pinpwd = cur_pinpwd_input.value;
    fetch("/mypage/check_pin_pwd", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ cur_pinpwd: cur_pinpwd }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.match) {
                window.location.href = "/mypage/mypage_temp";
            } else {
                alert("PIN 비밀번호가 일치하지 않습니다.");
            }
        })
        .catch((error) => {
            alert("비밀번호를 변경하는데 알수없는 오류가 발생하였습니다.");
        });
}

document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    submitPinButton();
});
