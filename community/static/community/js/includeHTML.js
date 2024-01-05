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