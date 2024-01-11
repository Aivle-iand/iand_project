const onclickPost = (event) => {
    const url = `http://127.0.0.1:8000/${event.currentTarget.id}`;
    window.location.href = url;
}