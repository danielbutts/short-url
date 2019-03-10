import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import React, { Component } from 'react';
import { Table, Form, Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      urls: {},
      isLoading: true,
      currentPage: 'home',
      inputValue: ''
    }
    this.clickHome = this.clickHome.bind(this);
    this.clickStats = this.clickStats.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { inputValue } = this.state;
    const response = await axios.post('http://localhost:5000/api/generate', { url: inputValue });
    console.log('POST RESPONSE', response);
  }

  componentDidMount() {
    this.fetchUrls();
  }

  formatDate(date) {
    const dateFormat = 'MM/DD/YYYY h:mm:ss a'
    return moment(date).format(dateFormat)
  }

  fetchUrls = async () => {
    try {
      const { data } = await axios.get('/api/urls');
      const { urls = {} } = data;
      this.setState({ urls, isLoading: false });
    } catch {
      console.error('Failed to load URLs');
    }
  }

  clickHome() {
    this.setState({ isLoading: true, currentPage: 'home' })
    this.fetchUrls();
  }

  clickStats() {
    this.setState({ currentPage: 'stats' })
  }

  renderNav = () => {
    const { currentPage } = this.state;
    const homeButtonStyle = currentPage === 'home' ? 'primary' : 'success';
    const statsButtonStyle = currentPage === 'home' ? 'success' : 'primary';
    return (
      <ButtonToolbar>
        <Button variant={homeButtonStyle} onClick={this.clickHome}>Home</Button>&nbsp;
        <Button variant={statsButtonStyle} onClick={this.clickStats}>Stats</Button>
      </ButtonToolbar>
    );
  }

  renderForm = () => {
    return (
      <div>
        <Container>
          <Row>
            <Col />
              <Col xs={9}>
              {this.renderNav()}
            </Col>
          </Row>
          <Row>&nbsp;</Row>
          <Row>
            <Col xs={9}>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                  <Form.Label>Full URL</Form.Label>
                  <Form.Control placeholder="Enter URL" value={this.state.inputValue} onChange={this.handleChange}/>
                  <Form.Text className="text-muted">
                    Enter a URL and click 'Submit' to generate a short URL.
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  renderStats = () => {
    const { urls } = this.state;
    const rows = urls.map((url) =>
      (<tr key={url.shorthash}>
        <td>{url.url}</td>
        <td>{url.shorthash}</td>
        <td>{url.hash}</td>
        <td>{this.formatDate(url.createddtm)}</td>
        <td>{this.formatDate(url.updatedttm)}</td>
      </tr>));

    return (
      <div>
        <Container>
          <Row>
            <Col />
              <Col xs={9}>
              {this.renderNav()}
            </Col>
          </Row>
          <Row>&nbsp;</Row>
          <Row>
            <Col />
            <Col xs={9}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Short Hash</th>
                    <th>Full Hash</th>
                    <th>Created</th>
                    <th>Last Used</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </Table>
            </Col>
            <Col />
          </Row>
        </Container>
      </div>
    );
  }

  render() {
    const { isLoading, currentPage  } = this.state;
    if (currentPage === 'stats') {
      if (!isLoading) {
        return this.renderStats();
      }
      return (
        <div>
          <header>
            Loading!
          </header>
        </div>
      );
    }
    return this.renderForm();
  }
}

export default App;
