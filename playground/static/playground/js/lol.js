const onblurQuizInput = (event) => {
    const id = event.target.id;
    const img = document.querySelector(`img#${id}`)
    if (!event.target.value) {
        img.setAttribute('src', '/static/playground/images/thinking.png');
    }
};
  
const onfocusQuizInput = (event) => {
    const id = event.target.id;
    const img = document.querySelector(`img#${id}`)
    img.setAttribute('src', '/static/playground/images/cool.png');
};

const onchangeQuizInput = (event) => {
    const id = event.target.id;
    const img = document.querySelector(`img.check_type#${id}`);
    if (!event.target.value) {
        img.setAttribute('src', '/static/playground/images/thinking.png');
    } else {
        img.setAttribute('src', '/static/playground/images/cool.png');
    }
}