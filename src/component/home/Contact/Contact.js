import React, { useEffect, useState } from 'react';
import Button from '@/shared/button/button';
import SectionInfo from '@/shared/sectionInfo';
import { Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { contactUsApi } from '@/services/Common';
import { toast } from 'react-toastify';
import Image from 'next/image';

const sectionInfo = [
  {
    title: "Get In Touch.",
    name: "Contact Us",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const obj = { ...formData, ip: ip };
    setLoading(true);
    const response = await contactUsApi("/Verify/phi-data-contact-us", obj);
    if (response?.data) {
      toast.success("Email send successfully");
      setFormData({
        name: "",
        email: "",
        comment: "",
      });
      setLoading(false);
    } else {
      console.log(response);
      toast.error(response?.response?.data?.message || "something went wrong");
    }
  };

  useEffect(() => {
    // Fetch the IP address using ipify API
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        setIp(response.data.ip);
      })
      .catch((error) => {
        console.error("Error fetching the IP address:", error);
      });
  }, []);

  return (
    <div className="contact-wrapper">
      <Container>
        <div className="contact-container">
          <Row>
            <Col xs={12} md={6} lg={6}>
              {sectionInfo.map((item, index) => (
                <SectionInfo
                  key={index}
                  sectionName={item.name}
                  sectionTitle={item.title}
                  textLeft
                />
              ))}
              <Form className="form-container">
                <Form.Group className="mb-4" controlId="full-name">
                  <Form.Label>Full Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="email">
                  <Form.Label>Email ID*</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="comment">
                  <Form.Label>Comment (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="comment"
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    rows={3}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  onClick={onSubmit}
                  className="golden-send white w-100 mt-4"
                  label="Send"
                >
                  <Image
                    alt="sendicon"
                    width={20}
                    height={20}
                    className="icon-send"
                    src={
                      loading ? "/icons/spinner.gif" : "/icons/send-icon.svg"
                    }
                  />
                  Send
                </Button>
              </Form>
            </Col>
            <Col xs={12} md={6} lg={6} style={{ display: "flex", alignItems: 'center' }}>
                <Image
                width={553}
                height={360}
                src="/images/Artboard.svg"
                />
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
