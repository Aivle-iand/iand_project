
document.addEventListener('mousemove', (e) => {
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    const elementStyle = getComputedStyle(elementUnderCursor);

    // 요소의 배경색 또는 글자색 중 하나를 선택합니다.
    const color = elementStyle.backgroundColor || elementStyle.color;

    // 반전 색상 계산 (예시)
    const invertedColor = invertColor(color);

    // 반전 색상으로 커서 업데이트
    updateCursorColor(invertedColor);

    updateCursorPosition(e.pageX, e.pageY); // pageX, pageY로 변경
});

function invertColor(hex) {
    // HEX 색상에서 #을 제거합니다.
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }

    // HEX 색상을 RGB 값으로 변환합니다.
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);

    // RGB 값을 반전합니다.
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    // 반전된 RGB 값을 HEX 형식으로 다시 변환합니다.
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function updateCursorColor(color) {
    const dot = document.getElementById('cursor-dot');
    dot.style.backgroundColor = `rgba(${color}, 1)`;
}

// 스크롤할 때도 사용자 정의 커서 위치를 업데이트
document.addEventListener('scroll', () => {
    updateCursorPosition(lastKnownX, lastKnownY);
});

// 마지막으로 알려진 마우스 위치를 저장하는 변수
let lastKnownX = 0;
let lastKnownY = 0;

// 커서 위치를 업데이트하는 함수
function updateCursorPosition(x, y) {
    lastKnownX = x;
    lastKnownY = y;

    const dot = document.getElementById('cursor-dot');
    const dotOutline = document.getElementById('cursor-dot-outline');

    dot.style.left = `${lastKnownX}px`;
    dot.style.top = `${lastKnownY}px`;
    dotOutline.style.left = `${lastKnownX}px`;
    dotOutline.style.top = `${lastKnownY}px`;

    dot.style.opacity = 1;
    dotOutline.style.opacity = 1;
}

document.addEventListener('mouseover', function(event) {
    if (event.target.closest('label, a, button')) {
        scaleCursor(5);  // 커서를 1.2배 늘립니다.
    }
});

document.addEventListener('mouseout', function(event) {
    if (event.target.closest('label, a, button')) {
        scaleCursor(1.0);  // 커서를 원래 크기로 복원합니다.
    }
});

function scaleCursor(scale) {
    const dot = document.getElementById('cursor-dot');
    const dotOutline = document.getElementById('cursor-dot-outline');

    dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
    dotOutline.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function red_dot(scale) {
    const dotOutline = document.getElementById('cursor-dot-outline');
    dotOutline.style.transform = `background(#0000FF)`
}