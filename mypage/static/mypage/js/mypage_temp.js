// -------------------------
// li부분 색깔 변화를 위한 js
document.addEventListener("DOMContentLoaded", function() {
  const navigationLinks = document.querySelectorAll('.internal_navigation_list a');
  const sections = document.querySelectorAll('.main_root > div');

  function updateImagePath(img, addRed) {
    let currentSrc = img.getAttribute('src');
    
    if (addRed && !currentSrc.includes('_red')) {
      currentSrc = currentSrc.replace('.png', '_red.png');
    } else if (!addRed && currentSrc.includes('_red')) {
      currentSrc = currentSrc.replace('_red.png', '.png');
    }
    
    img.setAttribute('src', currentSrc);
  }

  function getActiveSection() {
    let closestSection = null;
    let closestDistance = Infinity;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY - parseFloat(150); // padding-top 반영
      const distance = Math.abs(sectionTop - window.scrollY);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });

    return closestSection;
  }

  function updateLinkImages() {
    const activeSection = getActiveSection() || sections[0];

    navigationLinks.forEach(link => {
      const img = link.querySelector('img');
      const isActive = link.getAttribute('href') === `#${activeSection.id}`;
      updateImagePath(img, isActive);
    });
  }

  window.addEventListener('scroll', updateLinkImages);
  navigationLinks.forEach(link => {
    link.addEventListener('mouseenter', () => updateImagePath(link.querySelector('img'), true));
    link.addEventListener('mouseleave', updateLinkImages);
  });

  updateLinkImages();
});


//-----------------------
// 입력에 따라서 label, span의 변화를 위한 js
document.querySelectorAll('.password_change input').forEach(input => {
    input.addEventListener('input', function() {
      updateButtonStates(); // 버튼 상태를 업데이트
      toggleLabelAndSpan(input); // label과 span 상태를 업데이트
    });
  });
  
document.getElementById('pw_change_cancel_button').addEventListener('click', function() {
    document.querySelectorAll('.password_change input').forEach(input => {
      input.value = '';
      var label = input.nextElementSibling;
      var span = label.nextElementSibling;
      label.style.display = 'block';
      span.style.display = 'none';
    });
    helpText = document.getElementById("passwordHelp");
    helpText.innerHTML = "";
    updateButtonStates(); // 버튼 상태를 업데이트
  });

function toggleLabelAndSpan(input) {
    var label = input.nextElementSibling;
    var span = label.nextElementSibling;
  
    if (input.value || input === document.activeElement) {
      label.style.display = 'none';
      span.style.display = 'block';
    } else {
      label.style.display = 'block';
      span.style.display = 'none';
    }
  }
  
//------------------------
// cancel 버튼과 save 버튼 변화에 대한 js
function updateButtonStates() {
    const inputs = document.querySelectorAll('.password_change input');
    const isAnyInputFilled = Array.from(inputs).some(input => input.value);
    document.getElementById('pw_change_cancel_button').style.visibility = isAnyInputFilled ? 'visible' : 'hidden';
  }
  
document.addEventListener('DOMContentLoaded', function() {
    var nicknameInput = document.querySelector('.personal_nickname');
    var cancelButton = document.getElementById('nickname_change_cancel_button');
  
    // 입력 필드에 대한 이벤트 리스너
    nicknameInput.addEventListener('input', function() {
      // '취소' 버튼 표시 여부
      cancelButton.style.visibility = nicknameInput.value ? 'visible' : 'hidden';
  
      // '닉네임 변경' 버튼 스타일 변경
      changeButton.style.backgroundColor = nicknameInput.value ? 'rgb(209, 54, 57)' : '';
      changeButton.style.color = nicknameInput.value ? '#FFF' : '';
      changeButton.style.cursor = nicknameInput.value ? 'pointer' : '';
    });
  
    // '취소' 버튼 클릭 이벤트
    cancelButton.addEventListener('click', function() {
      nicknameInput.value = '';
      cancelButton.style.visibility = 'hidden';
      changeButton.style.backgroundColor = '';
      changeButton.style.color = '';
    });
  });
  
//-----------------------------------
// password 변경 부분
document.getElementById('password').addEventListener('input', updateSubmitButton);
document.getElementById('confirmPassword').addEventListener('input', updateSubmitButton);

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

function updateSubmitButton() { // 모든 도움말 텍스트를 확인하여 오류가 있는지 검사
    
  var pwChangeButton = document.getElementById('pw_change_button');
  if(is_error === true){
      pwChangeButton.style.backgroundColor = ''; // 기본 배경색
      pwChangeButton.style.color = ''; // 기본 텍스트 색상
      pwChangeButton.style.cursor = '';
  }

  else {
      pwChangeButton.style.backgroundColor = 'rgb(209, 54, 57)'; // 배경색 변경
      pwChangeButton.style.color = '#FFF'; // 텍스트 색상 변경 (예: 흰색으로 설정)
      pwChangeButton.style.cursor = 'pointer';
  }
  
  
}


//-----------------------------
//voice 파일 업로드 관련 js
var uploadArea = document.querySelector('.voice_upload_area');
var fileInput = document.getElementById('file_input');
var fileNameDisplay = document.querySelector('.voice_file_name');
var uploadInstruction = uploadArea.querySelector('.voice_upload_msg'); // 업로드 지시문 <p> 태그
var uploadVoiceButton = document.getElementById('voice_upload_button');
var voiceCancelButton = document.getElementById('voice_upload_cancel_button');


// 클릭으로 파일 업로드 창 열기
uploadArea.addEventListener('click', function() {
  fileInput.click();
});

// 파일 선택 시 파일 이름 표시 및 <p> 태그 숨김
fileInput.addEventListener('change', function(event) {
  handleFileUpload(event.target.files[0]);
});

// 드래그 앤 드롭 기능
uploadArea.addEventListener('dragover', function(event) {
  event.preventDefault();
});

uploadArea.addEventListener('drop', function(event) {
  event.preventDefault();
  handleFileUpload(event.dataTransfer.files[0]);
});

// 파일 처리 및 <p> 태그 숨김 처리 함수
function handleFileUpload(file) {
  if (file) {
    if (file.type === "audio/mpeg" || file.type === "audio/x-m4a") {
      fileNameDisplay.textContent = file.name; // 파일 이름 표시
      uploadInstruction.style.display = 'none'; // <p> 태그 숨김
      uploadVoiceButton.style.backgroundColor = 'red';
      uploadVoiceButton.style.color = 'white';
      voiceCancelButton.style.visibility = 'visible';
    } else {
      fileNameDisplay.textContent = "파일 형식이 .mp3, .m4a에 해당하지 않습니다.";
      uploadInstruction.style.display = 'none'; // <p> 태그 다시 표시
      voiceCancelButton.style.visibility = 'visible';
    }
  } else {
    uploadInstruction.style.display = 'block'; // 파일이 없을 때 <p> 태그 다시 표시
  }
}

voiceCancelButton.addEventListener('click', function() {
  // 파일 입력 필드와 파일 이름 표시 초기화
  fileInput.value = '';
  fileNameDisplay.textContent = '';

  // 업로드 지시문 <p> 태그 다시 표시
  uploadInstruction.style.display = 'block';

  // 버튼들의 스타일 초기화
  uploadVoiceButton.style.backgroundColor = '';
  uploadVoiceButton.style.color = '';
  voiceCancelButton.style.visibility = 'hidden';
});

function setupModal() {
  var modal = document.getElementById("deleteModal");
  var btn = document.getElementById("delete_button");
  var span = document.getElementById("close");
  var confirmDelete = document.getElementById("confirmDelete");
  var cancelDelete = document.getElementById("cancelDelete");

  btn.onclick = function() {
      modal.style.display = "block";
  }

  span.onclick = function() {
      modal.style.display = "none";
  }

  cancelDelete.onclick = function() {
      modal.style.display = "none";
  }

  confirmDelete.onclick = function() {
      // 여기에 계정 삭제 로직을 추가하세요
      console.log("계정 삭제 진행");
      modal.style.display = "none";
  }

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}

document.addEventListener('DOMContentLoaded', setupModal);


  
window.onload = updateButtonStates;