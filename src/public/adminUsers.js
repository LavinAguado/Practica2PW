const token = localStorage.getItem('token');
const ul = document.getElementById('users');

async function fetchUsers() {
  const query = `
    query {
      users {
        id
        username
        email
        role
      }
    }
  `;

  const res = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  renderUsers(data.data.users);
}

function renderUsers(users) {
  ul.innerHTML = '';

  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.username} (${u.email}) - ${u.role}`;

    const roleBtn = document.createElement('button');
    roleBtn.textContent = u.role === 'admin'
      ? 'Hacer user'
      : 'Hacer admin';

    roleBtn.onclick = () =>
      changeRole(u.id, u.role === 'admin' ? 'user' : 'admin');

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Eliminar';
    delBtn.onclick = () => deleteUser(u.id);

    li.append(roleBtn, delBtn);
    ul.appendChild(li);
  });
}

async function changeRole(id, role) {
  const query = `
    mutation {
      changeUserRole(id: "${id}", role: "${role}") {
        id
        role
      }
    }
  `;

  await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });

  fetchUsers();
}

async function deleteUser(id) {
  if (!confirm('¿Eliminar usuario?')) return;

  const query = `
    mutation {
      deleteUser(id: "${id}")
    }
  `;

  await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });

  fetchUsers();
}

fetchUsers();
