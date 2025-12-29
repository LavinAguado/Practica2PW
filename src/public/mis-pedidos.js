const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

const ordersUl = document.getElementById('orders');
const userInfo = document.getElementById('userInfo');

if (!token || !user) {
  alert('Debes iniciar sesión');
  window.location = '/login.html';
}

userInfo.textContent = `Pedidos de ${user.username}`;

async function fetchMyOrders() {
  const query = `
    query {
      myOrders {
        id
        total
        status
        createdAt
        products {
          quantity
          product {
            title
            price
          }
        }
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

  if (data.errors) {
    alert(data.errors[0].message);
    return;
  }

  renderOrders(data.data.myOrders);
}

function renderOrders(orders) {
  ordersUl.innerHTML = '';

  if (orders.length === 0) {
    ordersUl.innerHTML = '<li>No tienes pedidos todavía</li>';
    return;
  }

  orders.forEach(order => {
    const li = document.createElement('li');

    li.innerHTML = `
      <strong>Pedido #${order.id}</strong><br>
      Estado: ${order.status}<br>
      Total: ${order.total.toFixed(2)} €<br>
      Fecha: ${new Date(order.createdAt).toLocaleString()}
      <ul>
        ${order.products.map(p => `
          <li>
            ${p.product.title} x ${p.quantity}
            (${(p.product.price * p.quantity).toFixed(2)} €)
          </li>
        `).join('')}
      </ul>
      <hr>
    `;

    ordersUl.appendChild(li);
  });
}

fetchMyOrders();
