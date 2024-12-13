import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Table, Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiClient from '../../axiosConfig';

const NewDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/Dashboard'); // Adjust the endpoint as needed
        setData(response.data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  // Prepare data for charts
  const pieData = Object.entries(data.getEmployeeByDepartment).map(([department, count]) => ({ name: department, value: count }));

  const barData = Object.entries(data.getAverageSalaryByDepartmentAsync).map(([department, salary]) => ({ name: department, salary }));

  const tableData = data.getTop5EmployeesByWorkingHours;

  const followUpData = data.getFollowUpProcess;

  return (
    <Container fluid className="my-4 pb-5">
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>Employees by Department</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#0d6efd"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`} // Shows percentage on the chart
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={['#0d6efd', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14'][index % 5]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const { name, value } = payload[0].payload;
                          return (
                            <div
                              style={{
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                padding: '5px',
                                borderRadius: '5px',
                                textAlign: 'center',
                              }}
                            >
                              <p style={{ margin: 0 }}>{name}</p>
                              <p style={{ margin: 0 }}>Total: {value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>


        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>Average Salary by Department</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="salary" fill="#0d6efd" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>Top 5 Employees by Working Hours</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Employee Name</th>
                    <th>Total Hours Worked</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((employee, index) => (
                    <tr key={employee.employeeId}>
                      <td>{index + 1}</td>
                      <td>{employee.employeeName}</td>
                      <td>{employee.totalHoursWorked}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>Follow-Up Processes</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Request Name</th>
                    <th>Leave Type</th>
                    <th>Status</th>
                    <th>Action Required By</th>
                  </tr>
                </thead>
                <tbody>
                  {followUpData.map((process, index) => (
                    <tr key={process.requestId}>
                      <td>{index + 1}</td>
                      <td>{process.requestName}</td>
                      <td>{process.leaveType}</td>
                      <td>{process.status}</td>
                      <td>{process.requiresActionBy}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation Buttons */}
      <Row className="my-4">
        <Col md={4} className="mb-2">
          <Link to="/leave-report">
            <Button variant="primary" className="w-100">
              View Leave Report
            </Button>
          </Link>
        </Col>
        <Col md={4} className="mb-2">
          <Link to="/employee-report">
            <Button variant="primary" className="w-100">
              View Employee Report
            </Button>
          </Link>
        </Col>
        <Col md={4} className="mb-2">
          <Link to="/project-report">
            <Button variant="primary" className="w-100">
              View Project Report
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NewDashboard;
