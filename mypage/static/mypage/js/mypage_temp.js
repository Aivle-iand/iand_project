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

// modal js
const openModal = (event) => {
  if (!event) {
    return;
  }
  const drawTool = {
    'image-capture-btn': drawCapture,
    'voice-record-btn': drawRecord,
  }

  const modal = document.querySelector('div.modal');
  const modal_content = document.querySelector('div.modal_content');
  modal.classList.remove('hidden');

  const id = event.target.id;
  drawTool[id](modal_content);
}

const closeModal = (event) => {
  const modal = document.querySelector('div.modal');
  modal.classList.add('hidden');
}

const drawCapture = async (content) => {
  console.log('in drawCapture');
  const videoElement = document.getElementById("videoElement");
  const canvas = document.getElementById("canvas");
  const button = document.getElementById("capture");
  const directions = document.getElementById("directions");
  const ctx = canvas.getContext("2d");
  const modelPromise = ort.InferenceSession.create("https://raw.githubusercontent.com/Gichang404/models/master/yolov8n_onnx/face_detect.onnx");

  await navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
          videoElement.srcObject = stream;
      });

  detectFrame();

  async function detectFrame() {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const input = await prepare_input();

      const output = await run_model(input);
      const boxes = process_output(
          output,
          canvas.width,
          canvas.height
      );
      
      draw_image_and_boxes(boxes);

      requestAnimationFrame(detectFrame);
  }

  async function prepare_input() {
      const targetWidth = 224;
      const targetHeight = 224;
      const resizeCanvas = document.createElement('canvas');
      resizeCanvas.width = targetWidth;
      resizeCanvas.height = targetHeight;
      const resizeCtx = resizeCanvas.getContext('2d');
  
      // videoElement에서 이미지를 추출하여 리사이징
      resizeCtx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight, 0, 0, targetWidth, targetHeight);
      const pixels = resizeCtx.getImageData(0, 0, targetWidth, targetHeight).data;
  
      // ONNX Runtime에서 사용할 수 있는 텐서로 변환
      const red = [], green = [], blue = [];
        for (let index = 0; index < pixels.length; index += 4) {
            red.push(pixels[index]/255.0);
            green.push(pixels[index+1]/255.0);
            blue.push(pixels[index+2]/255.0);
        }
        const input = [...red, ...green, ...blue];

      return new ort.Tensor(Float32Array.from(input),[1, 3, 224, 224]);
  }
  

  async function run_model(input) {
      const model = await modelPromise;
      const outputs = await model.run({ images: input });

      return outputs["output0"].data;
  }

  function draw_image_and_boxes(boxes) {
      // 인식 여부에 따른 테두리, 버튼 제어
      canvas.style.borderWidth = "5px";
      if (boxes.length == 1 && boxes[0][4] == 'normal') {
          directions.textContent = "캡쳐 버튼을 눌러주세요."
          canvas.style.borderColor = "#00FF00";
          button.disabled = false;
      } else {
          canvas.style.borderColor = "red";
          button.disabled = true;
      }
      // directions
      if (boxes.length == 0) {
          directions.textContent = "얼굴이 인식되지 않았습니다."
      } else if (boxes.length == 1 && boxes[0][4] == 'abnormal') {
          directions.textContent = "정면을 바라봐 주세요."
      } else if (boxes.length > 1) {
          directions.textContent = "얼굴이 여러개 인식되었습니다."
      }
  }

  function process_output(output, img_width, img_height) {
      let boxes = [];
      for (let index = 0; index < 1029; index++) {
          // 최대 확률을 가진 클래스와 그 확률을 찾습니다.
          const [class_id, prob] = [...Array(80).keys()]
              .map(col => [col, output[1029 * (col + 4) + index]])
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
          boxes = boxes.filter(box => iou(current, box) < 0.7);
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
}

const drawRecord = (content) => {
  console.log('in drawRecord');
  console.log(content);
}

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
    document.getElementById('voice_input').files = files
    voice_input(files[0])
  }
}
