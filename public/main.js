const update = document.querySelector('#update-button');
const deleteButton = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message');

update.addEventListener('click', _ => {
  fetch('/recipes', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: 'Darth Vadar',
      title: 'New Updated Recipe wow so cool'
    })
  })
    .then(res => {
      if (res.ok) return res.json();
    })
    .then(response => {
      window.location.reload(true);
    })
});

deleteButton.addEventListener('click', _ => {
  fetch('/recipes', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: 'Darth Vadar'
    })
  })
    .then(res => {
      if (res.ok) return res.json();
    })
    .then(response => {
      if (response === 'No recipe to delete') {
        messageDiv.textContent = 'No Darth Vadar quote to delete';
      } else {
        window.location.reload(true);
      }
    })
    .catch(console.error);
});