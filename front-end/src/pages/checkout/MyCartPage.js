import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import NavBar from '../../components/NavBar';
import eventImg from '../../assets/mainPromotion.jpg';
import { apiFetch } from '../../api';

export default function MyCartPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const oRes = await apiFetch('/api/orders');
        if (!oRes.ok) throw new Error();
        const { orders: ordList } = await oRes.json();

        const withTickets = await Promise.all(
          ordList.map(async order => {
            const tRes = await apiFetch(`/api/orders/${order.order_id}/tickets`);
            if (!tRes.ok) throw new Error();
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

  const handleContinuePayment = order => {
    navigate(`/checkout/${order.event_id}`, {
      state: {
        orderId: order.order_id,
        selectedSeats: order.tickets.map(t => t.seat_number),
        isExistingOrder: true,
      },
    });
  };

  return (
    <>
      <NavBar />
      <Container className="my-5">
        <h2>My Cart & Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center my-5">
            <FaShoppingCart size={64} className="text-secondary mb-3" />
            <h4 className="text-secondary">You haven’t placed any orders yet.</h4>
            <p>
              <Link to="/" className="btn btn-primary">Browse Events</Link>
            </p>
          </div>
        ) : (
          orders.map(order => (
            <Card key={order.order_id} className="mb-4">
              <Card.Header className="d-flex justify-content-between">
                <span>Order #{order.order_id}</span>
                <span className={
                  order.payment_status.toLowerCase() === 'completed' ? 'text-success' : 'text-warning'
                }>
                  {order.payment_status.toUpperCase()}
                </span>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <p><strong>Event:</strong> {order.event_title}</p>
                    <p><strong>Ordered:</strong> {new Date(order.order_date).toLocaleString()}</p>
                    <p><strong>Tickets:</strong> {order.ticketQuantity}</p>
                    <p><strong>Total:</strong> €{Number(order.total_amount).toFixed(2)}</p>

                    {order.payment_status.toLowerCase() === 'completed' && (
                      <>
                        <p><strong>Seats:</strong></p>
                        <ul>
                          {order.tickets.map(t => <li key={t.ticket_id}>{t.seat_number}</li>)}
                        </ul>
                      </>
                    )}

                    {order.payment_status.toLowerCase() === 'pending' ? (
                      <Button variant="primary" onClick={() => handleContinuePayment(order)}>
                        Complete Payment
                      </Button>
                    ) : (
                      <Link to={`/confirmation/${order.order_id}`}>
                        <Button variant="outline-secondary">View / Download Tickets</Button>
                      </Link>
                    )}
                  </Col>
                  <Col md={4} className="d-flex align-items-center justify-content-center">
                    {order.poster && (
                      <img src={eventImg} alt="Event Poster" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 12, boxShadow: '0 0 8px rgba(0,0,0,0.1)' }} />
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </>
  );
}