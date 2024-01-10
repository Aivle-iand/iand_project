const test = () => {
  const select = document.querySelector('select.select_category_box');
  select.children[1].style.display = 'none';
}

fetch('/community/writepage/is_super/', {
  method: 'GET',
})
.then(response => {return response.json()})
.then(data => {if (!data.is_super) {
  test();
}})
.catch(error => console.log(error));

const app = () => {
  document.querySelector('label[for="id_postname"]').textContent = '제목';
  document.querySelector('label[for="id_category"]').textContent = '카테고리';
  document.querySelector('label[for="id_contents"]').textContent = '내용';
  const form = document.querySelector('form.wb_form');
  const firstChild = form.firstChild;

  const child1 = document.querySelector('input.form_control').parentNode;
  child1.setAttribute('class', 'title_area_title');
  const child2 = document.querySelector('select.select_category_box').parentNode;
  child2.setAttribute('class', 'title_area_category');
  
  const div = document.createElement('div');
  div.setAttribute('class', 'title_area')
  div.appendChild(child1);
  div.appendChild(child2);

  const hr = document.createElement('hr');

  form.insertBefore(div, firstChild);
}

app()