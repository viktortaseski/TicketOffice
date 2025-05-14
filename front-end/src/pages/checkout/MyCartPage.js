import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import NavBar from '../../components/NavBar';
import { apiFetch } from './api';

export default function MyCartPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // 1) fetch orders
        const oRes = await apiFetch('/api/orders');
        if (!oRes.ok) throw new Error('Could not load orders');
        const { orders: ordList } = await oRes.json();

        // 2) fetch tickets per order
        const withTickets = await Promise.all(
          ordList.map(async order => {
            const tRes = await apiFetch(
              `/api/orders/${order.order_id}/tickets`
            );
            if (!tRes.ok) throw new Error('Could not load tickets');
            const { tickets } = await tRes.json();
            return { ...order, tickets };
          })
        );

        setOrders(withTickets);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <>
      <NavBar />
      <Container className="my-5">
        <h2>My Cart & Orders</h2>

        {orders.length === 0 && <p>You have no orders yet.</p>}

        {orders.map(order => (
          <Card key={order.order_id} className="mb-4">
            <Card.Header className="d-flex justify-content-between">
              <span>Order #{order.order_id}</span>
              <span
                className={
                  order.payment_status === 'completed'
                    ? 'text-success'
                    : 'text-warning'
                }
              >
                {order.payment_status.toUpperCase()}
              </span>
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Event:</strong> {order.event_title}
              </p>
              <p>
                <strong>Ordered:</strong>{' '}
                {new Date(order.order_date).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> €
                {order.total_amount.toFixed(2)}
              </p>
              <p>
                <strong>Seats:</strong>
              </p>
              <ul>
                {order.tickets.map(t => (
                  <li key={t.ticket_id}>{t.seat_number}</li>
                ))}
              </ul>

              {order.payment_status === 'pending' ? (
                <Link to={`/events/${order.event_id}/seats`}>
                  <Button variant="primary">Complete Payment</Button>
                </Link>
              ) : (
                <Link to={`/confirmation/${order.order_id}`}>
                  <Button variant="outline-secondary">
                    View / Download Tickets
                  </Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        ))}
      </Container>
    </>
  );
}
