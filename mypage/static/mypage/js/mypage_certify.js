const updateButton = (event) => {
    const btn = document.getElementsByClassName('submit_btn');
    const svg = document.getElementsByClassName('submit_img');
    if (event.target.value) {
        btn[0].setAttribute('class', 'submit_btn activate');
        svg[0].setAttribute('class', 'submit_img activate');
    } else {
        btn[0].setAttribute('class', 'submit_btn');
        svg[0].setAttribute('class', 'submit_img');
    };
};