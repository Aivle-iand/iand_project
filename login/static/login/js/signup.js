var is_error = false; // 에러 발생여부

// ID 입력 양식 체크
function validateUserId() {
    var userId = document.getElementById("user_id").value;
    var userIdHelp = document.getElementById("userIdHelp");
    var lengthCheck = /^.{6,18}$/;
    var validRegex = /^[a-zA-Z0-9]+$/;

    is_error = false;

    if (!validRegex.test(userId) || !lengthCheck.test(userId)) {
        userIdHelp.style.color = 'red';
        userIdHelp.innerHTML = "아이디는 6~18자, 영문자와 숫자만 사용 가능합니다.";
        is_error = true;
    } else {
        userIdHelp.innerHTML = ""; // or any other success message or action
        is_error = false;
        checkUserIdDuplication(userId);
    }
}

function checkUserIdDuplication(userId) {
    // AJAX 요청 설정
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "signup/check_id_dup", true); // '/check-user-id'는 서버의 중복 확인 API 경로
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.isDuplicate) {
                userIdHelp.style.color = 'red';
                userIdHelp.innerHTML = "이미 사용 중인 아이디입니다.";
                is_error = true;
            } else {
                userIdHelp.style.color = 'green';
                userIdHelp.innerHTML = "사용 가능한 아이디입니다.";
                is_error = false;
            }
        }
    };

    // 서버에 요청 보내기
    xhr.send(JSON.stringify({ user_id: user_id }));
}



// 폼 제출 이벤트 또는 user_id 필드의 다른 이벤트에 validateUserId 함수를 연결합니다.
document.getElementById("user_id").onchange = validateUserId;

/*=========================================================================*/

// 비밀번호 재확인 기능
function validatePassword() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var helpText = document.getElementById("passwordHelp");

    var lengthCheck = /^.{8,16}$/;
    var specialCharCheck = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    is_error = false;

    if (!lengthCheck.test(password) || !specialCharCheck.test(password)) {
        helpText.style.color = 'red';
        helpText.innerHTML = "비밀번호는 최소 8자이상 최대 16자이하이며, 최소 하나의 특수 문자를 포함해야 합니다.";
        is_error = true;
        return;
    }

    if (password != confirmPassword) {
        helpText.style.color = 'red';
        helpText.innerHTML = "비밀번호가 서로 일치하지 않습니다.";
        is_error = true;

    } else {
        helpText.style.color = 'green';
        helpText.innerHTML = "비밀번호가 일치합니다.";
        is_error = false;
    }
}


/*=========================================================================*/
// 회원가입 버튼 활성화 / 비활성화
function updateSubmitButton() { // 모든 도움말 텍스트를 확인하여 오류가 있는지 검사
    
    if(is_error === true){
        submitBtn.disabled = true;
    }

    else {
        submitBtn.disabled = false;
    }
    
    
}
// 사용자의 입력에 따라 updateSubmitButton 함수를 지속적으로 호출
document.getElementById('user_id').addEventListener('input', updateSubmitButton);
document.getElementById('password').addEventListener('input', updateSubmitButton);
document.getElementById('confirmPassword').addEventListener('input', updateSubmitButton);
document.getElementById('username').addEventListener('input', updateSubmitButton);
document.getElementById('nickname').addEventListener('input', updateSubmitButton);
document.getElementById('security-answer').addEventListener('input', updateSubmitButton);