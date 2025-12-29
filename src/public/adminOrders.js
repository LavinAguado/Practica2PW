const token = localStorage.getItem('token');
const ordersUl = document.getElementById('orders');
const filter = document.getElementById('statusFilter');

async function fetchOrders(status = '') {
  const query = status
    ? `
      query {
        ordersByStatus(status: "${status}") {
          id
          total
          status
          user { username }
        }
      }
    `
    : `
      query {
        orders {
          id
          total
          status
          user { username }
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
  renderOrders(data.data.orders || data.data.ordersByStatus);
}

function renderOrders(orders) {
  ordersUl.innerHTML = '';

  orders.forEach(o => {
    const li = document.createElement('li');

    const info = document.createElement('span');
    info.textContent = `
      Usuario: ${o.user.username}
      | Total: ${o.total} €
      | Estado: ${o.status}
    `;

    const btn = document.createElement('button');
    btn.textContent =
      o.status === 'PENDING' ? 'Marcar como COMPLETED' : 'Marcar como PENDING';

    btn.onclick = () =>
      updateStatus(o.id, o.status === 'PENDING' ? 'COMPLETED' : 'PENDING');

    li.append(info, btn);
    ordersUl.appendChild(li);
  });

}


filter.onchange = () => {
  fetchOrders(filter.value);
};

async function updateStatus(orderId, status) {
  const query = `
    mutation {
      updateOrderStatus(id: "${orderId}", status: "${status}") {
        id
        status
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

  fetchOrders(filter.value);
}

fetchOrders();
