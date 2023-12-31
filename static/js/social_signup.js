var errors = {
    first_name: false,
    last_name: false,
    nickname: false, 
};

function validatefirstName() {
    var first_name = document.getElementById("first_name").value;
    var isEmpty = first_name.trim() === "";
    errors.first_name = isEmpty; // 비어있으면 true
    console.log("First Name Error:", errors.first_name);
    updateSubmitButton();
}

function validatelastName() {
    var last_name = document.getElementById("last_name").value;
    var isEmpty = last_name.trim() === "";
    errors.last_name = isEmpty; // 비어있으면 true
    console.log("Last Name Error:", errors.last_name);
    updateSubmitButton();
}

function validateNickName() {
    var nickname = document.getElementById("nickname").value;
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
document.getElementById('first_name').addEventListener('input', updateSubmitButton);
document.getElementById('last_name').addEventListener('input', updateSubmitButton);
document.getElementById('nickname').addEventListener('input', updateSubmitButton);
