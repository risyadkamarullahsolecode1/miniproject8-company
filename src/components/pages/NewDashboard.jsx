import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Table, Container, Row, Col, Button } from 'react-bootstrap';
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
    <Container>
      <Row className="my-4">
        <Col md={6}>
          <h3>Employees by Department</h3>
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
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0d6efd', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col md={6}>
          <h3>Average Salary by Department</h3>
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
        </Col>
      </Row>

      <Row className="my-4">
        <Col md={6}>
          <h3>Top 5 Employees by Working Hours</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
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
        </Col>

        <Col md={6}>
          <h3>Follow-Up Processes</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
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
        </Col>
      </Row>

      <Link to="/leave-report">
        <Button variant="primary">
            View Leave Report
        </Button>
      </Link>
      <Link to="/employee-report">
        <Button variant="primary">
            View Employee Report
        </Button>
      </Link>
      <Link to="/project-report">
        <Button variant="primary">
            View Project Report
        </Button>
      </Link>
    </Container>
  );
};

export default NewDashboard;
