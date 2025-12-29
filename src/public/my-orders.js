const token = localStorage.getItem('token');

if (!token) {
  alert('Debes iniciar sesión');
  window.location = '/';
}

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
  const container = document.getElementById('orders');
  container.innerHTML = '';

  if (orders.length === 0) {
    container.innerHTML = '<p>No tienes pedidos todavía.</p>';
    return;
  }

  orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'order';

    div.innerHTML = `
      <h3>Pedido #${order.id}</h3>
      <p><strong>Estado:</strong> ${order.status}</p>
      <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <ul>
        ${order.products.map(p => `
          <li>
            ${p.product.title} x ${p.quantity}
            (${(p.product.price * p.quantity).toFixed(2)} €)
          </li>
        `).join('')}
      </ul>
      <p><strong>Total:</strong> ${order.total.toFixed(2)} €</p>
    `;

    container.appendChild(div);
  });
}

fetchMyOrders();
