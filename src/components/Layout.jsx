// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';

// eslint-disable-next-line react/prop-types
export default function Layout({ children }) {
  return (
    <Container fluid className="p-0">
        <Row>
            <Col xs={2}>
                <Sidebar />
            </Col>
            <Col xs={10}>
                {children}
            </Col>
        </Row>
    </Container>
  )
}
