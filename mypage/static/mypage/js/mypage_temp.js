// -------------------------
// li부분 색깔 변화를 위한 js

const app = () => {};
window.onload = app();

const userInfo = {};
let stream = null;

document.addEventListener("DOMContentLoaded", function () {
  const navigationLinks = document.querySelectorAll(
    ".internal_navigation_list a"
  );
  const sections = document.querySelectorAll(".main_root > div");

  function updateImagePath(img, addRed) {
    let currentSrc = img.getAttribute("src");

    if (addRed && !currentSrc.includes("_red")) {
      currentSrc = currentSrc.replace(".png", "_red.png");
    } else if (!addRed && currentSrc.includes("_red")) {
      currentSrc = currentSrc.replace("_red.png", ".png");
    }

    img.setAttribute("src", currentSrc);
  }

  function getActiveSection() {
    let closestSection = null;
    let closestDistance = Infinity;

    sections.forEach((section) => {
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

    navigationLinks.forEach((link) => {
      const img = link.querySelector("img");
      const isActive = link.getAttribute("href") === `#${activeSection.id}`;
      updateImagePath(img, isActive);
    });
  }

  window.addEventListener("scroll", updateLinkImages);
  navigationLinks.forEach((link) => {
    link.addEventListener("mouseenter", () =>
      updateImagePath(link.querySelector("img"), true)
    );
    link.addEventListener("mouseleave", updateLinkImages);
  });

  updateLinkImages();
});

// modal js
const openModal = (event) => {
  if (!event) {
    return;
  }
  const drawTool = {
    'image-capture-btn': drawCapture,
    'audio-record-btn': drawRecord,
  }

  const modal = document.querySelector('div.modal');
  const modal_content = document.querySelector('div.modal_content');
  const id = event.target.id;
  drawTool[id](modal_content, modal);
}

const closeModal = () => {
  const modal = document.querySelector("div.modal");
  stopStreaming();
  modal.classList.add("hidden");
};

function stopStreaming() {
  if (stream) {
    // 각 트랙을 반복하여 중지
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
}

const faceCapture = async (event) => {
  const preView = document.querySelector("img#face_img");
  const videoElement = document.getElementById("videoElement");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  await canvas.toBlob(function (blob) {
    const imageUrl = URL.createObjectURL(blob);
    userInfo["image_upload"] = blob;
    preView.src = imageUrl;
  }, "image/png");

  closeModal();
  stopStreaming();
};

const drawCapture = async (content, modal) => {
  const videoElement = document.getElementById("videoElement");
  const canvas = document.getElementById("canvas");
  const directions = document.getElementById("directions");
  const ctx = canvas.getContext("2d");
  const modelPromise = ort.InferenceSession.create("https://raw.githubusercontent.com/Gichang404/models/master/yolov8n_onnx/face_detect.onnx");

  await navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
          stream = stream;
          videoElement.srcObject = stream;
          modal.classList.remove('hidden');
          detectFrame();
      })
      .catch(() =>alert('미디어 장치에 접근할 권한이 없거나 장치를 찾을 수 없습니다..'));

  async function detectFrame() {
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const input = await prepare_input();

    const output = await run_model(input);
    const boxes = process_output(output, canvas.width, canvas.height);

    draw_image_and_boxes(boxes);

    requestAnimationFrame(detectFrame);
  }

  async function prepare_input() {
    const targetWidth = 224;
    const targetHeight = 224;
    const resizeCanvas = document.createElement("canvas");
    resizeCanvas.width = targetWidth;
    resizeCanvas.height = targetHeight;
    const resizeCtx = resizeCanvas.getContext("2d");

    // videoElement에서 이미지를 추출하여 리사이징
    resizeCtx.drawImage(
      videoElement,
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );
    const pixels = resizeCtx.getImageData(0, 0, targetWidth, targetHeight).data;

    // ONNX Runtime에서 사용할 수 있는 텐서로 변환
    const red = [],
      green = [],
      blue = [];
    for (let index = 0; index < pixels.length; index += 4) {
      red.push(pixels[index] / 255.0);
      green.push(pixels[index + 1] / 255.0);
      blue.push(pixels[index + 2] / 255.0);
    }
    const input = [...red, ...green, ...blue];

    return new ort.Tensor(Float32Array.from(input), [1, 3, 224, 224]);
  }

  async function run_model(input) {
    const model = await modelPromise;
    const outputs = await model.run({ images: input });

    return outputs["output0"].data;
  }

  function allowedButton(button, img) {
    button.style.border = "15px solid #A397C6";
    button.style.cursor = "pointer";
    img.style.filter =
      "invert(66%) sepia(14%) saturate(692%) hue-rotate(214deg) brightness(92%) contrast(88%)";
    button.style.pointerEvents = "auto";
  }

  function rejectedButton(button, img) {
    button.style.border = "15px solid #6F6490";
    button.style.pointerEvents = "none";
    img.style.filter =
      "invert(39%) sepia(12%) saturate(1169%) hue-rotate(214deg) brightness(101%) contrast(87%)";
  }

  function draw_image_and_boxes(boxes) {
    // 인식 여부에 따른 테두리, 버튼 제어
    const button = document.querySelector("div.capture-btn");
    const img = document.querySelector("img.capture-img");
    canvas.style.borderWidth = "5px";
    if (boxes.length == 1 && boxes[0][4] == "normal") {
      directions.textContent = "캡쳐 버튼을 눌러주세요.";
      directions.style.color = canvas.style.borderColor = "#4df4d3";
      allowedButton(button, img);
    } else {
      canvas.style.borderColor = directions.style.color = "#d953e5";
      rejectedButton(button, img);
    }
    // directions
    if (boxes.length == 0) {
      directions.textContent = "얼굴이 인식되지 않았습니다.";
    } else if (boxes.length == 1 && boxes[0][4] == "abnormal") {
      directions.textContent = "정면을 바라봐 주세요.";
    } else if (boxes.length > 1) {
      directions.textContent = "얼굴이 여러개 인식되었습니다.";
    }
  }

  function process_output(output, img_width, img_height) {
    let boxes = [];
    for (let index = 0; index < 1029; index++) {
      // 최대 확률을 가진 클래스와 그 확률을 찾습니다.
      const [class_id, prob] = [...Array(80).keys()]
        .map((col) => [col, output[1029 * (col + 4) + index]])
        .reduce((max, item) => (item[1] > max[1] ? item : max), [0, 0]);

      // 확률이 낮은 경우 건너뜁니다.
      if (prob < 0.5) {
        continue;
      }

      // 레이블과 경계 상자 좌표를 추출합니다.
      const label = yolo_classes[class_id];
      const xc = output[index];
      const yc = output[1029 + index];
      const w = output[2 * 1029 + index];
      const h = output[3 * 1029 + index];

      // 좌표를 원본 이미지 크기에 맞게 스케일링합니다.
      const x1 = ((xc - w / 2) / 224) * img_width;
      const y1 = ((yc - h / 2) / 224) * img_height;
      const x2 = ((xc + w / 2) / 224) * img_width;
      const y2 = ((yc + h / 2) / 224) * img_height;

      // 추출된 정보를 boxes 배열에 추가합니다.
      boxes.push([x1, y1, x2, y2, label, prob]);
    }

    // 확률에 따라 boxes 배열을 정렬합니다.
    boxes.sort((box1, box2) => box2[5] - box1[5]);

    // Non-Maximum Suppression (NMS)을 적용하여 중복을 제거합니다.
    const result = [];
    while (boxes.length > 0) {
      const current = boxes.shift();
      result.push(current);
      boxes = boxes.filter((box) => iou(current, box) < 0.7);
    }

    return result;
  }

  function iou(box1, box2) {
    return intersection(box1, box2) / union(box1, box2);
  }

  function union(box1, box2) {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const box1_area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1);
    const box2_area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1);
    return box1_area + box2_area - intersection(box1, box2);
  }

  function intersection(box1, box2) {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const x1 = Math.max(box1_x1, box2_x1);
    const y1 = Math.max(box1_y1, box2_y1);
    const x2 = Math.min(box1_x2, box2_x2);
    const y2 = Math.min(box1_y2, box2_y2);
    return (x2 - x1) * (y2 - y1);
  }

  // class label
  const yolo_classes = ["normal", "abnormal"];
};

const drawRecord = (content) => {
  alert('추후 개발될 기능입니다.')
};

//-----------------------
// 입력에 따라서 label, span의 변화를 위한 js

const onClickInputWrapper = (e) => {
  const id = e.target.id;
  const label = document.querySelector(`label#${id}`);
  const span = document.querySelector(`span.input-label#${id}`);
  const input = document.querySelector(`input.type-input#${id}`);

  label.style.display = "none";
  span.style.display = "block";
  input.style.position = "relative";
  input.style.bottom = "13px";
  input.focus();
  input.addEventListener("focusout", () => {
    if (!input.value) {
      label.style.display = "block";
      span.style.display = "none";
      input.style.bottom = "0px";
    }
  });
};

const onClickViewPwd = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const id = e.target.id;
  const input = document.querySelector(`input.type-input#${id}`);
  if (!input.value) {
    return;
  }

  const button = document.querySelector(`button.view_pwd#${id}`);

  if (input.attributes[0].value == "password") {
    input.setAttribute("type", "text");
    button.style.backgroundImage = "url('/static/mypage/img/eye-open.png')";
  } else {
    input.setAttribute("type", "password");
    button.style.backgroundImage = "url('/static/mypage/img/eye-close.png')";
  }
};

//-----------------------------
//voice 파일 업로드 관련 js
// 클릭으로 파일 업로드 창 열기
const uploadClick = (event) => {
  const id = event.currentTarget.id;
  const input = document.getElementById(id + "_input");
  input.click();
};

const validFile = (file, id) => {
  const [type, formet] = file.type.split('/');
  const size = file.size;

  function imageValid() {
    const formets = ['jpg', 'jpeg', 'png', 'svg'];
    const maxSize = 2 * (1024 * 1024);

    if (!(file instanceof File)) {
      alert("파일 형식이 아닙니다.");
      return false;
    };

    if (!formets.includes(formet)) {
      alert("지원하는 포멧이 아닙니다. \n지원 포멧: jpg, jpeg, png, svg");
      return false;
    };

    if (size > maxSize) {
      alert(
        `이미지 사이즈가 너무 큽니다. ${maxSize}MB 이하의 파일을 올려주세요.`
      );
      return false;
    };

    return true;
  };
function audioValid() {
    const formets = ['mp3', 'wav', 'aac', 'ogg', 'm4a', 'flac', 'x-m4a', 'mpeg'];
    const maxSize = 10 * (1024 * 1024);

    if (!(file instanceof File)) {
      alert('파일 형식이 아닙니다.');
      return false;
    };
    if (!formets.includes(formet)) {
      alert('지원하는 포멧이 아닙니다. \n지원 포멧: mp3, wav, aac, ogg, m4a, flac, m4a, mpeg');
      return false;
    };

    if (size > maxSize) {
      alert(`오디오 사이즈가 너무 큽니다. ${maxSize}mb 이하의 파일을 올려주세요.`);
      return false;
    };

    return true;
  };

  const functions = {
    'image': imageValid,
    'audio': audioValid,
  };
  
  if (type !== id.split('_')[0]) {
    alert('형식에 맞는 파일을 올려주세요.');
    return false;
  };

  is_true = functions[type]();

  return is_true;
};

const image_input = (file) => {
  const reader = new FileReader();
  userInfo['image_upload'] = file;
  reader.onload = () => {
    const img_url = reader.result;
    const img = document.getElementById('face_img');
    img.src = img_url;
  }
  reader.readAsDataURL(file);

  document.getElementById('preview_notice').textContent = '현재 업로드된 이미지 입니다.'
  document.getElementById('image_name').textContent = `File Name : ${file.name}`;
  document.getElementById('image_msg').textContent = '클릭하여 이미지를 변경하거나';
}

const voice_input = (file) => {
  userInfo['audio_upload'] = file;
  const audioPreview = document.getElementById('audioPreview');
  audioPreview.src = URL.createObjectURL(file);

  document.getElementById('audio_name').textContent = `File Name : ${file.name}`;
  document.getElementById('audio_msg').textContent = '클릭하여 음을파일을 변경하거나';
  document.getElementById('playIcon').style = 'filter: invert(86%) sepia(0%) saturate(0%) hue-rotate(275deg) brightness(86%) contrast(91%); cursor: pointer;'
}

const onloadeddataFile = (event) => {
  event.stopPropagation();
  event.preventDefault();
  const id = event.currentTarget.id;
  const file = event.target.files[0];
  
  if (!validFile(file, id)) {
    return;
  }

  if (id == 'image_input') {
    image_input(file)
  } else if (id == 'audio_input') {
    voice_input(file)
  }
}

const onclickPlayIcon = (event) => {
  event.stopPropagation();
  event.preventDefault();
  const audioPreview = document.getElementById('audioPreview');
  if (audioPreview.src) {
      audioPreview.play();
  }
}

const onDragOverUpload = (event) => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

const onDropUpload = (event) => {
  event.stopPropagation();
  event.preventDefault();
  const files = event.dataTransfer.files;
  if ((event.target.id).includes('image')) {
    document.getElementById('image_input').files = files
    image_input(files[0])
  } else {
    document.getElementById('audio_input').files = files
    voice_input(files[0])
  }
}

// media file upload(image or voice)
const onClickUploadMedia = (event) => {
  const id = event.target.id;
  const file = userInfo[id];

  if (!file) {
    alert("파일을 등록해주세요.");
    return;
  }

  // FormData 객체 생성
  const formData = new FormData();
  formData.append("file", file);

  // 백엔드 서버로 파일 전송
  fetch("/mypage/mypage_temp/upload_media/", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => alert("파일 업로드에 성공했습니다."))
    .catch((_) => alert("업로드에 실패했습니다."));
};

let nickname_input = "";
document.addEventListener("DOMContentLoaded", function () {
  var dupCheckButton = document.querySelector("#nickname_check");
  var nicknameInput = document.querySelector("#nickname-input");
  let nicknameChange = document.getElementById("nickname_change");

  dupCheckButton.addEventListener("click", function () {
    var nickname = nicknameInput.value;
    var requestUrl = `/mypage/mypage_temp/check_nickname?personal_nickname=${encodeURIComponent(
      nickname
    )}`;
    fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.is_taken) {
          alert("중복된 닉네임이 존재합니다.");
        } else {
          alert("닉네임 변경이 가능합니다.");
          nickname_input = nickname;
        }
      })
      .catch((error) => {
        alert("중복체크하는 과정에서 알수없는 에러가 발생했습니다.");
      });
  });

  nicknameChange.addEventListener("click", function () {
    let nickname_now = nicknameInput.value;
    if (nickname_input == nickname_now) {
      fetch("/mypage/mypage_temp/change_nickname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_nickname: nickname_now }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          window.location.reload();
        });
    } else {
      alert("닉네임 중복 체크를 다시 진행해주세요!");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.querySelector("input.type-input#new-pwd");
  const passwordCheckInput = document.querySelector("input.type-input#chk-pwd");
  const passwordCurrentInput = document.querySelector(
    "input.type-input#cur-pwd"
  );
  let curpassHelp = document.getElementById("cur-pass-help");
  let passHelp = document.getElementById("pass-help");
  let chkpassHelp = document.getElementById("chk-pass-help");
  let passChk = document.querySelector(".pass-chk");
  let passLen = document.querySelector(".passlen");
  let passInit = document.querySelector(".passinit");
  let curpassError = true;
  let chkpassError = true;
  let newpassError = true;
  const passwordSaveButton = document.getElementById("pwd-change-button");

  passwordCurrentInput.addEventListener("input", function () {
    let curPassword = this.value;
    let password_cur_container = document.querySelector(
      "div.input_container#cur-pwd"
    );

    fetch("/mypage/mypage_temp/check-current-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cur_password: curPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.match) {
          curpassError = false;
          password_cur_container.style.border = "1px solid #4df4d3";
          passChk.style.color = "#4df4d3";
          passChk.innerHTML = "비밀번호가 일치합니다.";
        } else {
          curpassError = true;
          password_cur_container.style.border = "1px solid #d953e5";
          passChk.style.color = "#d953e5";
          passChk.innerHTML = "비밀번호가 일치하지 않습니다.";
        }
      });
  });

  passwordCurrentInput.addEventListener("focus", function () {
    curpassHelp.style.display = "block";
    passHelp.style.display = "none";
    chkpassHelp.style.display = "none";
  });

  // input에 focus 되었을 때
  passwordInput.addEventListener("focus", function () {
    curpassHelp.style.display = "none";
    passHelp.style.display = "block";
    chkpassHelp.style.display = "none";
  });

  passwordCheckInput.addEventListener("focus", function () {
    curpassHelp.style.display = "none";
    passHelp.style.display = "none";
    chkpassHelp.style.display = "block";
  });

  passwordCheckInput.addEventListener("blur", function () {
    let password = passwordInput.value;
    let password_chk = passwordCheckInput.value;
    if (password_chk === "" && password === "") {
      chkpassHelp.style.display = "none";
    }
  });

  passwordCheckInput.addEventListener("input", function () {
    let password = passwordInput.value;
    let password_chk = passwordCheckInput.value;
    let password_chk_container = document.querySelector(
      "div.input_container#chk-pwd"
    );
    if (password_chk === "") {
      password_chk_container.style.border = "";
    } else {
      if (password_chk === password) {
        chkpassHelp.style.color = "#4df4d3";
        chkpassHelp.innerHTML = "비밀번호가 일치합니다.";
        password_chk_container.style.border = "1px solid #4df4d3";
        newpassError = false;
      } else {
        chkpassHelp.style.color = "#d953e5";
        chkpassHelp.innerHTML = "비밀번호가 일치하지 않습니다.";
        password_chk_container.style.border = "1px solid #d953e5";
        newpassError = true;
      }
    }
  });
  // input에 입력되는 내용 확인
  passwordInput.addEventListener("input", function () {
    let password = passwordInput.value;
    let password_chk = passwordCheckInput.value;
    var lengthCheck = password.length >= 8 && password.length <= 16;
    var specialCharCheck = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      password
    );
    let password_container = document.querySelector(
      "div.input_container#new-pwd"
    );
    let password_chk_container = document.querySelector(
      "div.input_container#chk-pwd"
    );

    // 비밀번호 길이 검사
    if (lengthCheck) {
      passLen.style.color = "#4df4d3";
    } else {
      passLen.style.color = "#d953e5";
    }

    // 특수 문자 포함 검사
    if (specialCharCheck) {
      passInit.style.color = "#4df4d3";
    } else {
      passInit.style.color = "#d953e5";
    }

    if (lengthCheck && specialCharCheck) {
      password_container.style.border = "1px solid #4df4d3";
      chkpassError = false;
    } else {
      password_container.style.border = "1px solid #d953e5";
      chkpassError = true;
    }
    if (password_chk === "") {
      password_chk_container.style.border = "";
    } else {
      if (password == password_chk) {
        password_chk_container.style.border = "1px solid #4df4d3";
        chkpassHelp.innerHTML = "비밀번호가 일치합니다.";
        chkpassHelp.style.color = "#4df4d3";
        newpassError = false;
      } else {
        password_chk_container.style.border = "1px solid #d953e5";
        chkpassHelp.innerHTML = "비밀번호가 일치하지 않습니다.";
        chkpassHelp.style.color = "#d953e5";
        newpassError = true;
      }
    }
  });

  passwordSaveButton.addEventListener("click", function () {
    curPassword = passwordInput.value;
    if (!curpassError && !newpassError && !chkpassError) {
      fetch("/mypage/mypage_temp/change_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cur_password: curPassword }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          window.location.reload();
        });
    } else {
      alert("입력된 필드를 확인하세요.");
    }
  });
});

function confirmDeletion() {
  let result = confirm("정말로 계정을 삭제하시겠습니까?");
  if (result) {
    fetch("/mypage/mypage_temp/delete_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "delete" }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        window.location.reload();
      })
      .catch(() => {
        alert("계정 삭제에 실패했습니다. \n다시 시도해 주세요.");
      });
  }
}
