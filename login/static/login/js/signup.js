// JavaScript
function validateUserId() {
    var userId = document.getElementById("user_id").value;
    var userIdHelp = document.getElementById("userIdHelp");
    var lengthCheck = /^.{6,18}$/;
    var validRegex = /^[a-zA-Z0-9]+$/;

    if (!validRegex.test(userId) || !lengthCheck.test(userId)) {
        userIdHelp.style.color = 'red';
        userIdHelp.innerHTML = "아이디는 6~18자, 영문자와 숫자만 사용 가능합니다.";
    } else {
        userIdHelp.innerHTML = ""; // or any other success message or action
    }
}

// 폼 제출 이벤트 또는 user_id 필드의 다른 이벤트에 validateUserId 함수를 연결합니다.
document.getElementById("user_id").onchange = validateUserId;


// 아이디 중복 체크
function checkUserIdAvailability() {
    
    var userId = document.getElementById("user_id").value;
    var helpText = document.getElementById("userIdHelp");

    // AJAX 요청을 보내 user_id 중복 여부를 검사합니다.
    $.ajax({
        url: 'accounts/signup', // Django의 URL 패턴에 맞게 조정하세요.
        data: {
            'user_id': userId
        },
        dataType: 'json',
        success: function(data) {
            // 서버로부터 응답을 받아 사용자에게 메시지를 표시합니다.
            if(data.is_taken) {
                helpText.style.color = 'red';
                helpText.innerHTML = "이미 사용중인 아이디입니다.";
            } else {
                helpText.style.color = 'green';
                helpText.innerHTML = "사용 가능한 아이디입니다.";
            }
        }
    });
}

// 이벤트 리스너를 추가하여 사용자가 입력을 멈춘 후 검사를 진행합니다.
var timeoutId;

document.getElementById('user_id').oninput = function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(checkUserIdAvailability, 1000); // 사용자 입력 후 1초 대기
};



// 비밀번호 재확인 기능
function validatePassword() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var helpText = document.getElementById("passwordHelp");

    var lengthCheck = /^.{8,16}$/;
    var specialCharCheck = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (!lengthCheck.test(password) || !specialCharCheck.test(password)) {
        helpText.style.color = 'red';
        helpText.innerHTML = "비밀번호는 최소 8자이상 최대 16자이하이며, 최소 하나의 특수 문자를 포함해야 합니다.";
        return;
    }

    if (password != confirmPassword) {
        helpText.style.color = 'red';
        helpText.innerHTML = "비밀번호가 서로 일치하지 않습니다.";
    } else {
        helpText.style.color = 'green';
        helpText.innerHTML = "비밀번호가 일치합니다.";
    }
}

function updateSubmitButton() {
    var helpTexts = document.querySelectorAll('#userIdHelp, #passwordHelp');
    var submitBtn = document.getElementById('submitBtn');
    for (var i = 0; i < helpTexts.length; i++) {
        if (helpTexts[i].innerHTML !== "" && helpTexts[i].style.color === 'red') {
            submitBtn.disabled = true; // 오류 메시지가 있고, 색이 빨간색이면 비활성화
            return;
        }
    }
    submitBtn.disabled = false; // 오류 메시지가 없으면 활성화
}