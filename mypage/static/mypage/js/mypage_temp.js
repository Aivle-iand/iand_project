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

const onClickInputWrapper = (e) => {
    const id = e.target.id;
    const label = document.querySelector(`label#${id}`); 
    const span = document.querySelector(`span.input-label#${id}`);
    const input = document.querySelector(`input.type-input#${id}`);

    label.style.display = 'none';
    span.style.display = 'block';
    input.style.position = 'relative';
    input.style.bottom = '13px';
    input.focus();
    input.addEventListener('focusout', () => {
      if (!input.value) {
        label.style.display = 'block';
        span.style.display = 'none';
        input.style.bottom = '0px';
      }
    })
}

const onClickViewPwd = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const id = e.target.id;
  const input = document.querySelector(`input.type-input#${id}`);
  if (! input.value) {
    return;
  }

  const button = document.querySelector(`button.view_pwd#${id}`);

  if (input.attributes[0].value == 'password') {
    input.setAttribute('type', 'text');
    button.style.backgroundImage = "url('https://iand-bucket.s3.ap-northeast-2.amazonaws.com/media/common/eye-open.png')";
  } else {
    input.setAttribute('type', 'password');
    button.style.backgroundImage = "url('https://iand-bucket.s3.ap-northeast-2.amazonaws.com/media/common/eye-close.png')";
  }
}

//------------------------
// cancel 버튼과 save 버튼 변화에 대한 j

  
//-----------------------------------


//-----------------------------
//voice 파일 업로드 관련 js
let fileInput = document.getElementById('file_input');
let fileNameDisplay = document.querySelector('.voice_file_name');
// let uploadInstruction = uploadArea.querySelector('.voice_upload_msg'); // 업로드 지시문 <p> 태그
let uploadVoiceButton = document.getElementById('voice_upload_button');
let voiceCancelButton = document.getElementById('voice_upload_cancel_button');

let uploadArea = document.querySelector('.upload_area');
let uploadImage = null;
let uploadVoice = null;

// 클릭으로 파일 업로드 창 열기
const uploadClick = (event) => {
  const id = event.currentTarget.id;
  const input = document.getElementById(id + "_input");
  input.click();
}

const image_input = (file) => {
  uploadImage = file;
  const reader = new FileReader();

  reader.onload = () => {
    const img_url = reader.result;
    const img = document.getElementById('face_img');
    img.src = img_url;
  }

  reader.readAsDataURL(file);

  document.getElementById('image_name').textContent = `File Name : ${file.name}`;
  document.getElementById('image_msg').textContent = '클릭하여 이미지를 변경하거나';
}

const voice_input = (file) => {
  if (!file) {
    return 
  }
  uploadVoice = file;
  const audioPreview = document.getElementById('audioPreview');
  audioPreview.src = URL.createObjectURL(file);

  document.getElementById('voice_name').textContent = `File Name : ${file.name}`;
  document.getElementById('voice_msg').textContent = '클릭하여 음을파일을 변경하거나';
  document.getElementById('playIcon').style = 'filter: invert(86%) sepia(0%) saturate(0%) hue-rotate(275deg) brightness(86%) contrast(91%); cursor: pointer;'
}

const inputOnchange = (event) => {
  const id = event.currentTarget.id;
  const file = event.target.files[0];
  if (id == 'image_input') {
    image_input(file)
  } else if (id == 'voice_input') {
    voice_input(file)
  }
}

const onclickPlayIcon = () => {
  const audioPreview = document.getElementById('audioPreview');
  if (audioPreview.src) {
      console.log('in if')
      audioPreview.play();
  }
}

const onDragOverUpload = (event) => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

const onDropUpload = (event) => {
  console.log(event)
  event.stopPropagation();
  event.preventDefault();
  const files = event.dataTransfer.files;
  if ((event.target.id).includes('image')) {
    document.getElementById('image_input').files = files
    image_input(files[0])
  } else {
    document.getElementById('voice_input').files = files
    voice_input(files[0])
  }
}

// 파일 처리 및 <p> 태그 숨김 처리 함수
// function handleFileUpload(file) {
//   if (file) {
//     if (file.type === "audio/mpeg" || file.type === "audio/x-m4a") {
//       fileNameDisplay.textContent = file.name; // 파일 이름 표시
//       uploadInstruction.style.display = 'none'; // <p> 태그 숨김
//       uploadVoiceButton.style.backgroundColor = 'red';
//       uploadVoiceButton.style.color = 'white';
//       voiceCancelButton.style.visibility = 'visible';
//     } else {
//       fileNameDisplay.textContent = "파일 형식이 .mp3, .m4a에 해당하지 않습니다.";
//       uploadInstruction.style.display = 'none'; // <p> 태그 다시 표시
//       voiceCancelButton.style.visibility = 'visible';
//     }
//   } else {
//     uploadInstruction.style.display = 'block'; // 파일이 없을 때 <p> 태그 다시 표시
//   }
// }
