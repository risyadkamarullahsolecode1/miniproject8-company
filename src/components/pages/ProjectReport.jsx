import React, { useState } from 'react';
import { Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Document, Page, pdfjs } from 'react-pdf';
import apiClient from '../../axiosConfig';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ProjectReport = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/Project/generate-project-report', {
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
      link.setAttribute('download', 'Project_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <Container>
      <Row className="my-4">
        <Col md={6}>
          <h3>Generate Project Report</h3>
          <Button
            variant="primary"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Generate Report'}
          </Button>
        </Col>
        <Col md={6}>
          {error && <Alert variant="danger">{error}</Alert>}
          {pdfFile && (
            <>
              <Button variant="success" className="mb-3" onClick={handleDownloadPDF}>
                Download PDF
              </Button>
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Spinner animation="border" />}
              >
                <Page pageNumber={pageNumber} width={800} />
              </Document>
              {numPages && (
                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="secondary"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {pageNumber} of {numPages}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectReport;
