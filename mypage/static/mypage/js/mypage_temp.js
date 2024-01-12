// -------------------------
// li부분 색깔 변화를 위한 js

const app = () => {};
window.onload = app();

const userInfo = {};
let stream = null;
let stopWatch = null;
let isCount = false;
let time = null;
let mediaRecorder = null;
let audioChunks = [];

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
            const isActive =
                link.getAttribute("href") === `#${activeSection.id}`;
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
        "image-capture-btn": drawCapture,
        "audio-record-btn": drawRecord,
    };

    const modal = document.querySelector("div.modal");
    const modal_content = document.querySelector("div.modal_content");
    const id = event.target.id;
    modal_content.innerHTML = "";
    drawTool[id](modal_content, modal);
};

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
    const modalContentMain = document.createElement("div");
    modalContentMain.setAttribute("class", "modal_content_main");
    content.appendChild(modalContentMain);

    const videoElement = document.createElement("video");
    videoElement.setAttribute("id", "videoElement");
    videoElement.setAttribute("height", "420");
    videoElement.setAttribute("width", "640");
    videoElement.setAttribute("autoplay", "true");
    modalContentMain.appendChild(videoElement);

    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("height", "420");
    canvas.setAttribute("width", "640");
    modalContentMain.appendChild(canvas);

    const directions = document.createElement("p");
    directions.setAttribute("class", "directions");
    modalContentMain.appendChild(directions);

    const modalContentFooter = document.createElement("div");
    modalContentFooter.setAttribute("class", "modal_content_footer");
    content.appendChild(modalContentFooter);

    const captureBtn = document.createElement("div");
    captureBtn.setAttribute("class", "capture-btn");
    captureBtn.setAttribute("onclick", "faceCapture(event)");
    modalContentFooter.appendChild(captureBtn);

    const captureImg = document.createElement("img");
    captureImg.setAttribute("class", "capture-img");
    captureImg.setAttribute("src", "/static/mypage/img/capture.png");
    captureBtn.appendChild(captureImg);

    const ctx = canvas.getContext("2d");
    const modelPromise = ort.InferenceSession.create(
        "https://raw.githubusercontent.com/Gichang404/models/master/yolov8n_onnx/face_detect.onnx"
    );

    await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            stream = stream;
            videoElement.srcObject = stream;
            modal.classList.remove("hidden");
            detectFrame();
        })
        .catch(() =>
            alert(
                "미디어 장치에 접근할 권한이 없거나 장치를 찾을 수 없습니다.."
            )
        );

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
        const pixels = resizeCtx.getImageData(
            0,
            0,
            targetWidth,
            targetHeight
        ).data;

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

const onClickRecording = async (event) => {
    const playTime = document.querySelector("span#play_time");
    const playBtn = document.querySelector("img#play_btn");
    if (!isCount) {
        isCount = true;
        if (time) {
            playTime.textContent = "00:00";
            time = 0;
        }
        stopWatch = setInterval(() => {
            time += 1;
            const min = Math.floor((time % 3600) / 60)
                .toString()
                .padStart(2, "0");
            const sec = (time % 60).toString().padStart(2, "0");
            console.log(`${min}:${sec}`);
            playTime.textContent = `${min}:${sec}`;
        }, 1000);
        playBtn.setAttribute("src", "/static/mypage/img/stop-circle.png");

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        mediaRecorder = new MediaRecorder(stream);

        // 데이터가 사용 가능할 때마다 새로운 청크를 audioChunks 배열에 추가
        mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
        });

        // 녹음이 중지되면 Blob 객체를 생성하고 오디오 요소의 소스로 설정
        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            userInfo["audio_upload"] = audioBlob;
            audioChunks = [];
        });

        mediaRecorder.start();
    } else {
        isCount = false;
        clearInterval(stopWatch);
        playBtn.setAttribute("src", "/static/mypage/img/play-circle.png");
        mediaRecorder.stop();
    }
};

const onClickCompleteRecording = (event) => {
    const playBtn = document.querySelector("img#play_btn");
    const playTime = document.querySelector("span#play_time");
    console.log("isStart");
    isCount = false;
    time = 0;
    clearInterval(stopWatch);
    playTime.textContent = "00:00";
    playBtn.setAttribute("src", "/static/mypage/img/play-circle.png");
    mediaRecorder.stop();

    const modal = document.querySelector("div.modal");
    const audioPreview = document.getElementById("audioPreview");
    const audioUrl = URL.createObjectURL(userInfo["audio_upload"]);
    audioPreview.src = audioUrl;

    document.getElementById(
        "audio_name"
    ).textContent = `File Name : recording_voice.mp3`;
    document.getElementById("audio_msg").textContent =
        "클릭하여 음을파일을 변경하거나";
    document.getElementById("playIcon").style =
        "filter: invert(86%) sepia(0%) saturate(0%) hue-rotate(275deg) brightness(86%) contrast(91%); cursor: pointer;";
    modal.classList.add("hidden");
    console.log("isEnd");
};

const drawRecord = (content, modal) => {
    modal.classList.remove("hidden");
    const modalContentMainAudio = document.createElement("div");
    modalContentMainAudio.setAttribute("class", "modal_content_main audio");

    const scriptWrapper = document.createElement("div");
    scriptWrapper.setAttribute("class", "script_wrapper");
    modalContentMainAudio.appendChild(scriptWrapper);

    const p = document.createElement("p");
    p.innerHTML = `그렇게 우리는 매 순간 물의 여정과 함께하고
  있습니다. <br>우리의 몸과 영혼을 유지하는 이 물은,
  우리가 매일 마시고 사용하는 것 이상의 의미를
  가집니다. <br>그것은 고대부터 현대에 이르기까지,
  문명의 발전과 함께해왔으며, 우리의 역사와 문화
  속에 깊이 자리 잡고 있지요. <br>또한, 물은 우리가
  누리는 자연의 아름다움을 통해 우리에게 삶의
  기쁨을 선사합니다. <br>맑은 강물을 따라 흐르는
  산책길, 빗방울이 촉촉이 내리는 정원, 그리고 푸른
  바다가 펼쳐지는 해변은 모두 물이 있기에 가능한
  풍경들입니다.<br> 그러나 이러한 풍경을 후대에도
  그대로 물려줄 수 있을지는 오늘 우리의 선택에
  달려 있습니다.<br> 물 절약과 환경 보호는 이제 선택이
  아닌 필수가 되었고, 이는 각 개인의 작은 실천에서
  시작됩니다.<br> 물을 아끼는 일, 오염을 줄이는 노력,
  그리고 지속 가능한 사용은 모두 우리 삶의 질을
  향상시키는 중요한 행동입니다. <br>지금 이 순간에도
  세계 곳곳에서는 물 부족으로 고통받는 사람들이
  있습니다.<br> 깨끗한 물이 충분하지 않아 질병에
  시달리고, 삶의 질이 떨어지는 이들에게 우리의
  작은 실천 하나하나가 큰 변화를 가져올 수
  있습니다. <br>우리가 당연하게 여기는 한 잔의 물이,
  다른 누군가에겐 소중한 선물이 될 수 있음을 잊지
  말아야 합니다.<br> 이제 우리는 물의 여정을 더 깊이
  이해하고, 그 가치를 존중하는 삶을 살아갈 준비가
  되었습니다. <br>물 한 방울에 담긴 생명의 소중함을
  기억하며, 이 지구를 아름답게 가꾸어 가는 데
  앞장서야 할 때입니다.<br> 물의 여정이 끝나지 않는
  한, 우리의 여정도 계속됩니다.<br> 자연과 더불어
  조화롭게 살아가는 삶, 그것이 바로 우리가 꿈꾸는
  미래이자, 우리가 지향해야 할 지속 가능한 삶의
  방식입니다. <br>물이 주는 교훈을 가슴에 새기며,
  오늘도 우리는 물과 함께 흐르는 삶을 살아갑니다.<br>
  지구상의 모든 생명과 함께하는 이 물의 여정에
  동행하면서, 우리 모두는 더 나은 내일을 향해 한
  걸음 한 걸음 나아갈 것입니다. <br> 그렇게, 물과
  함께하는 여정은 영원히 계속됩니다.`;
    scriptWrapper.appendChild(p);

    content.appendChild(modalContentMainAudio);

    const modalContentFooterAudio = document.createElement("div");
    modalContentFooterAudio.setAttribute("class", "modal_content_footer audio");

    const playWrapper = document.createElement("div");
    playWrapper.setAttribute("class", "play_wrapper");
    modalContentFooterAudio.appendChild(playWrapper);

    const playBtn = document.createElement("img");
    playBtn.setAttribute("id", "play_btn");
    playBtn.setAttribute("src", "/static/mypage/img/play-circle.png");
    playBtn.setAttribute("onclick", "onClickRecording(event)");
    playWrapper.appendChild(playBtn);

    const playTime = document.createElement("span");
    playTime.setAttribute("id", "play_time");
    playTime.textContent = "00:00";
    playWrapper.appendChild(playTime);

    const div = document.createElement("div");
    const saveButton = document.createElement("button");
    saveButton.textContent = "적용하기";
    saveButton.setAttribute("class", "save_button");
    saveButton.setAttribute("id", "record_save");
    saveButton.setAttribute("onclick", "onClickCompleteRecording(event)");
    div.appendChild(saveButton);

    modalContentFooterAudio.appendChild(div);
    content.appendChild(modalContentFooterAudio);
};

//-----------------------
// 입력에 따라서 label, span의 변화를 위한 js

const onClickInputWrapper = (e) => {
    const id = e.target.id;
    const label = document.querySelector(`label#${id}`);
    const span = document.querySelector(`span.input-label#${id}`);
    const input = document.querySelector(`input.type-input#${id}`);

    if (label) {
        label.style.display = "none";
    }

    if (span) {
        span.style.display = "block";
    }
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
        button.style.backgroundImage =
            "url('/static/mypage/img/eye-close.png')";
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
    const [type, formet] = file.type.split("/");
    const size = file.size;

    function imageValid() {
        const formets = ["jpg", "jpeg", "png", "svg"];
        const maxSize = 2 * (1024 * 1024);

        if (!(file instanceof File)) {
            alert("파일 형식이 아닙니다.");
            return false;
        }

        if (!formets.includes(formet)) {
            alert("지원하는 포멧이 아닙니다. \n지원 포멧: jpg, jpeg, png, svg");
            return false;
        }

        if (size > maxSize) {
            alert(
                `이미지 사이즈가 너무 큽니다. ${maxSize}MB 이하의 파일을 올려주세요.`
            );
            return false;
        }

        return true;
    }
    function audioValid() {
        const formets = [
            "mp3",
            "wav",
            "aac",
            "ogg",
            "m4a",
            "flac",
            "x-m4a",
            "mpeg",
        ];
        const maxSize = 10 * (1024 * 1024);

        if (!(file instanceof File)) {
            alert("파일 형식이 아닙니다.");
            return false;
        }
        if (!formets.includes(formet)) {
            alert(
                "지원하는 포멧이 아닙니다. \n지원 포멧: mp3, wav, aac, ogg, m4a, flac, m4a, mpeg"
            );
            return false;
        }

        if (size > maxSize) {
            alert(
                `오디오 사이즈가 너무 큽니다. ${maxSize}mb 이하의 파일을 올려주세요.`
            );
            return false;
        }

        return true;
    }

    const functions = {
        image: imageValid,
        audio: audioValid,
    };

    if (type !== id.split("_")[0]) {
        alert("형식에 맞는 파일을 올려주세요.");
        return false;
    }

    is_true = functions[type]();

    return is_true;
};

const image_input = (file) => {
    const reader = new FileReader();
    userInfo["image_upload"] = file;
    reader.onload = () => {
        const img_url = reader.result;
        const img = document.getElementById("face_img");
        img.src = img_url;
    };
    reader.readAsDataURL(file);

    document.getElementById("preview_notice").textContent =
        "현재 업로드된 이미지 입니다.";
    document.getElementById(
        "image_name"
    ).textContent = `File Name : ${file.name}`;
    document.getElementById("image_msg").textContent =
        "클릭하여 이미지를 변경하거나";
};

const voice_input = (file) => {
    userInfo["audio_upload"] = file;
    const audioPreview = document.getElementById("audioPreview");
    audioPreview.src = URL.createObjectURL(file);

    document.getElementById(
        "audio_name"
    ).textContent = `File Name : ${file.name}`;
    document.getElementById("audio_msg").textContent =
        "클릭하여 음을파일을 변경하거나";
    document.getElementById("playIcon").style =
        "filter: invert(86%) sepia(0%) saturate(0%) hue-rotate(275deg) brightness(86%) contrast(91%); cursor: pointer;";
};

const onloadeddataFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const id = event.currentTarget.id;
    const file = event.target.files[0];

    if (!validFile(file, id)) {
        return;
    }

    if (id == "image_input") {
        image_input(file);
    } else if (id == "audio_input") {
        voice_input(file);
    }
};

let isPlaying = false;
const onclickPlayIcon = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const audioPreview = document.getElementById("audioPreview");
    const playIcon = document.querySelector("img#playIcon");

    if (!isPlaying && audioPreview.src) {
        audioPreview.play();
        playIcon.setAttribute("src", "/static/mypage/img/stop-circle.svg");
        isPlaying = true;
    } else {
        audioPreview.pause();
        playIcon.setAttribute("src", "/static/mypage/img/play-circle.svg");
        isPlaying = false;
    }
};

const onDragOverUpload = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
};

const onDropUpload = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (event.target.id.includes("image")) {
        document.getElementById("image_input").files = files;
        image_input(files[0]);
    } else {
        document.getElementById("audio_input").files = files;
        voice_input(files[0]);
    }
};

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
    var lengthCheck = /^.{2,10}$/;

    dupCheckButton.addEventListener("click", function () {
        var nickname = nicknameInput.value;
        var requestUrl = `/mypage/mypage_temp/check_nickname?personal_nickname=${encodeURIComponent(
            nickname
        )}`;
        if (!lengthCheck.test(nickname)) {
            alert("닉네임은 최소 2자이상 최대 10자 이하 이어야 합니다.");
        } else {
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
                    alert(
                        "중복 체크하는 과정에서 알수없는 에러가 발생했습니다."
                    );
                });
        }
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
    const passwordCheckInput = document.querySelector(
        "input.type-input#chk-pwd"
    );
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

    if (passwordCurrentInput) {
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
                        password_cur_container.style.border =
                            "1px solid #4df4d3";
                        passChk.style.color = "#4df4d3";
                        passChk.innerHTML = "비밀번호가 일치합니다.";
                    } else {
                        curpassError = true;
                        password_cur_container.style.border =
                            "1px solid #d953e5";
                        passChk.style.color = "#d953e5";
                        passChk.innerHTML = "비밀번호가 일치하지 않습니다.";
                    }
                });
        });
    }

    if (passwordCurrentInput) {
        passwordCurrentInput.addEventListener("focus", function () {
            curpassHelp.style.display = "block";
            passHelp.style.display = "none";
            chkpassHelp.style.display = "none";
        });
    }

    // input에 focus 되었을 때
    if (passwordInput) {
        passwordInput.addEventListener("focus", function () {
            curpassHelp.style.display = "none";
            passHelp.style.display = "block";
            chkpassHelp.style.display = "none";
        });
    }

    if (passwordCheckInput) {
        passwordCheckInput.addEventListener("focus", function () {
            curpassHelp.style.display = "none";
            passHelp.style.display = "none";
            chkpassHelp.style.display = "block";
        });
    }

    if (passwordCheckInput) {
        passwordCheckInput.addEventListener("blur", function () {
            let password = passwordInput.value;
            let password_chk = passwordCheckInput.value;
            if (password_chk === "" && password === "") {
                chkpassHelp.style.display = "none";
            }
        });
    }

    if (passwordCheckInput) {
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
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", function () {
            let password = passwordInput.value;
            let password_chk = passwordCheckInput.value;
            var lengthCheck = password.length >= 8 && password.length <= 16;
            var specialCharCheck =
                /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
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
    }

    // input에 입력되는 내용 확인
    if (passwordSaveButton) {
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
    }
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
