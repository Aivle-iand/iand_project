var errors = {
    first_name: false,
    last_name: false,
    nickname: false, 
};


 // ID 중복체크
 function checkusernameDuplication(username) {
    // AJAX 요청 설정
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "check_username_dup", true); // '/check-user-id'는 서버의 중복 확인 API 경로
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.isDuplicate) {
                usernameHelp.style.color = 'red';
                usernameHelp.innerHTML = "이미 사용 중인 아이디입니다.";
                errors.username = true;
            } else {
                usernameHelp.style.color = 'green';
                usernameHelp.innerHTML = "사용 가능한 아이디입니다.";
                errors.username = false;
            }
        }
        updateSubmitButton();
    };

    // 서버에 요청 보내기
    xhr.send(JSON.stringify({ username: username }));
}

// ID 입력 양식 체크
function validateUsername() {
    var username = document.getElementById("id_username").value;
    var usernameHelp = document.getElementById("usernameHelp");
    var lengthCheck = /^.{6,18}$/;
    var validRegex = /^[a-zA-Z0-9]+$/;

    errors.username = false;

    if (!validRegex.test(username) || !lengthCheck.test(username)) {
        usernameHelp.style.color = 'red';
        usernameHelp.innerHTML = "아이디는 6~18자, 영문자와 숫자만 사용 가능합니다.";
        errors.username = true;
    } else {
        usernameHelp.innerHTML = ""; // or any other success message or action
        errors.username = false;
        checkusernameDuplication(username);
    }
}





// 폼 제출 이벤트 또는 username 필드의 다른 이벤트에 validateUsername 함수를 연결합니다.
document.getElementById("username").onchange = validateUsername;


function validatefirstName() {
    var first_name = document.getElementById("id_first_name").value;
    var isEmpty = first_name.trim() === "";
    errors.first_name = isEmpty; // 비어있으면 true
    console.log("First Name Error:", errors.first_name);
    updateSubmitButton();
}

function validatelastName() {
    var last_name = document.getElementById("id_last_name").value;
    var isEmpty = last_name.trim() === "";
    errors.last_name = isEmpty; // 비어있으면 true
    console.log("Last Name Error:", errors.last_name);
    updateSubmitButton();
}

function validateNickName() {
    var nickname = document.getElementById("id_nickname").value;
    var isEmpty = nickname.trim() === "";
    errors.nickname = isEmpty; // 비어있으면 true
    console.log("Nickname Error:", errors.nickname);
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
document.getElementById('id_first_name').addEventListener('input', updateSubmitButton);
document.getElementById('id_last_name').addEventListener('input', updateSubmitButton);
document.getElementById('id_nickname').addEventListener('input', updateSubmitButton);
