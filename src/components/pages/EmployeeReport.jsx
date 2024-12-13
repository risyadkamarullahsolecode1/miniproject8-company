import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import apiClient from '../../axiosConfig';

const EmployeeReport = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    if (!departmentName) {
      setError('Please enter a department name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/Department/generate-employee-report`, {
        params: { departmentName },
        responseType: 'blob', // Important for handling PDF files
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfFile(pdfUrl);
    } catch (err) {
      setError('Failed to generate report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (pdfFile) {
      const link = document.createElement('a');
      link.href = pdfFile;
      link.setAttribute('download', `Employee_Report_${departmentName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container>
      <Row className="my-4">
        <Col md={6}>
          <h3>Generate Employee Report</h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Generate Report'}
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          {error && <Alert variant="danger">{error}</Alert>}
          {pdfFile && (
            <>
              <Button variant="success" className="mb-3" onClick={handleDownloadPDF}>
                Download PDF
              </Button>
              <iframe
                src={pdfFile}
                title="Employee Report"
                width="100%"
                height="600px"
                style={{ border: '1px solid #ddd' }}
              ></iframe>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeReport;
