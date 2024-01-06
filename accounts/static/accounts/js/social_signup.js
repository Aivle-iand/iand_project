var errors = {
    first_name: false,
    last_name: false,
    nickname: false,
    pin: false, 
};


function checkNicknameDuplication(nickname, nicknameHelp) {
    // AJAX 요청 설정
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "social_check_nickname_dup", true); // '/check-user-id'는 서버의 중복 확인 API 경로
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.isDuplicate) {
                nicknameHelp.style.color = 'red';
                nicknameHelp.innerHTML = "이미 사용 중인 닉네임입니다.";
                errors.nickname = true;
            } else {
                nicknameHelp.style.color = 'green';
                nicknameHelp.innerHTML = "사용 가능한 닉네임입니다.";
                errors.nickname = false;
            }
        }
        updateSubmitButton();
    };

    // 서버에 요청 보내기
    xhr.send(JSON.stringify({ nickname: nickname }));
}

function validateNickname() {
    var nickname = document.getElementById("nickname").value;
    var nicknameHelp = document.getElementById("nicknameHelp");
    var isEmpty = nickname.trim() === "";
    errors.nickname = isEmpty; // 비어있으면 true
    checkNicknameDuplication(nickname, nicknameHelp)
    updateSubmitButton();
}

function validatelastName() {
    var last_name = document.getElementById("last_name").value;
    var isEmpty = last_name.trim() === "";
    errors.last_name = isEmpty; // 비어있으면 true
    console.log("Last Name Error:", errors.last_name);
    updateSubmitButton();
}

function validatefirstName() {
    var first_name = document.getElementById("first_name").value;
    var isEmpty = first_name.trim() === "";
    errors.first_name = isEmpty; // 비어있으면 true
    console.log("First Name Error:", errors.first_name);
    updateSubmitButton();
}
function validateSecurityAnswer() {
    var pin = document.getElementById("pin_number").value;
    var isEmpty = pin.trim() === "";
    var lengthCheck = /^.{4,4}$/;
    var specialCharCheck = /^[0-9]+$/;
    var helpText = document.getElementById("pinHelp");
    errors.pin = false;

    if (!lengthCheck.test(pin) || !specialCharCheck.test(pin)) {
        helpText.style.color = 'red';
        helpText.innerHTML = "PIN 번호는 4자리의 숫자입니다.";
        errors.pin = true;
        return;
    }

    else {
        helpText.style.color = 'green';
        helpText.innerHTML = "사용 가능한 PIN 번호입니다.";
        errors.pin = false;
    }

    errors.pin = isEmpty; // 비어있으면 true
    updateSubmitButton();
}
/*=========================================================================*/
// 회원가입 버튼 활성화 / 비활성화
function updateSubmitButton() { // 모든 도움말 텍스트를 확인하여 오류가 있는지 검사
    
    var allValid = Object.values(errors).every(val => val === false);
    console.log("All Valid:", allValid);
    var info_text = document.getElementById("info_text");

    if(allValid) {
        document.getElementById('submitBtn').disabled = false;
        info_text.innerHTML = "";
        
    } else {
        info_text.style.color = 'red';
        info_text.innerHTML = "모든 필드를 입력하거나 경고문구를 해결해주세요.";
        document.getElementById('submitBtn').disabled = true;
    }
}
    
// 사용자의 입력에 따라 updateSubmitButton 함수를 지속적으로 호출
document.getElementById('last_name').addEventListener('input', updateSubmitButton);
document.getElementById('first_name').addEventListener('input', updateSubmitButton);
document.getElementById('nickname').addEventListener('input', updateSubmitButton);
