const app = () => {
    document.querySelector('label[for="id_postname"]').textContent = '제목';
    document.querySelector('label[for="id_contents"]').textContent = '내용';
    const form = document.querySelector('form.update_form');
    const firstChild = form.firstChild;
  
    const child1 = document.querySelector('input.form_control').parentNode;
    child1.setAttribute('class', 'title_area_title');
    
    div.setAttribute('class', 'title_area')
  
    form.insertBefore(div, firstChild);
  }
  
  app()