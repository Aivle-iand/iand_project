var errors = {
    userId: true,
    password: true,
    agreement: true,
    username: true,
    nickname: true, 
    securityAnswer: true 
};

 // ID 중복체크
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
                errors.userId = true;
            } else {
                userIdHelp.style.color = 'green';
                userIdHelp.innerHTML = "사용 가능한 아이디입니다.";
                errors.userId = false;
            }
        }
        updateSubmitButton();
    };

    // 서버에 요청 보내기
    xhr.send(JSON.stringify({ user_id: userId }));
}

// ID 입력 양식 체크
function validateUserId() {
    var userId = document.getElementById("user_id").value;
    var userIdHelp = document.getElementById("userIdHelp");
    var lengthCheck = /^.{6,18}$/;
    var validRegex = /^[a-zA-Z0-9]+$/;

    errors.userId = false;

    if (!validRegex.test(userId) || !lengthCheck.test(userId)) {
        userIdHelp.style.color = 'red';
        userIdHelp.innerHTML = "아이디는 6~18자, 영문자와 숫자만 사용 가능합니다.";
        errors.userId = true;
    } else {
        userIdHelp.innerHTML = ""; // or any other success message or action
        errors.userId = false;
        checkUserIdDuplication(userId);
    }
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

    errors.password = false;

    if (!lengthCheck.test(password) || !specialCharCheck.test(password)) {
        helpText.style.color = 'red';
        helpText.innerHTML = "비밀번호는 최소 8자이상 최대 16자이하이며, 최소 하나의 특수 문자를 포함해야 합니다.";
        errors.password = true;
        return;
    }

    if (password != confirmPassword) {
        helpText.style.color = 'red';
        helpText.innerHTML = "비밀번호가 서로 일치하지 않습니다.";
        errors.password = true;

    } else {
        helpText.style.color = 'green';
        helpText.innerHTML = "비밀번호가 일치합니다.";
        errors.password = false;
    }
    updateSubmitButton();
}

function validateAgreement() {
    var agree = document.getElementById('agree').checked;
    var disagree = document.getElementById('disagree').checked;
    var privacyHelp = document.getElementById("privacyHelp");

    // Resetting default state
    errors.agreement = false;
    privacyHelp.style.color = 'initial';

    if (agree) {
        privacyHelp.style.color = 'green';
        privacyHelp.innerHTML = "개인정보수집에 동의했습니다.";
        errors.agreement = false;
        // Do something or simply pass if no action needed when agreed
    } else if (disagree) {
        privacyHelp.style.color = 'red';
        privacyHelp.innerHTML = "개인정보수집에 동의해야합니다.";
        errors.agreement = true;
    } else {
        // Neither agree nor disagree is selected
        privacyHelp.style.color = 'red';
        privacyHelp.innerHTML = "개인정보수집 동의 여부를 선택해주세요.";
        errors.agreement = true;
    }
    updateSubmitButton();
}
function validateUsername() {
    var username = document.getElementById("username").value;
    var isEmpty = username.trim() === "";
    errors.username = isEmpty; // 비어있으면 true
    updateSubmitButton();
}

function checkNicknameDuplication(nickname) {
    // AJAX 요청 설정
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "signup/check_nickname_dup", true); // '/check-user-id'는 서버의 중복 확인 API 경로
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
    checkNicknameDuplication(nickname)
    updateSubmitButton();
}

function validateSecurityAnswer() {
    var securityAnswer = document.getElementById("security-answer").value;
    var isEmpty = securityAnswer.trim() === "";
    errors.securityAnswer = isEmpty; // 비어있으면 true
    updateSubmitButton();
}

/*=========================================================================*/
// 회원가입 버튼 활성화 / 비활성화
function updateSubmitButton() { // 모든 도움말 텍스트를 확인하여 오류가 있는지 검사
    
    var allValid = Object.values(errors).every(val => val === false);
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
document.getElementById('user_id').addEventListener('input', updateSubmitButton);
document.getElementById('password').addEventListener('input', updateSubmitButton);
document.getElementById('confirmPassword').addEventListener('input', updateSubmitButton);
document.getElementById('username').addEventListener('input', updateSubmitButton);
document.getElementById('nickname').addEventListener('input', updateSubmitButton);
document.getElementById('security-answer').addEventListener('input', updateSubmitButton);
document.getElementById('agree').onchange = validateAgreement;
document.getElementById('disagree').onchange = validateAgreement;