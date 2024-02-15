import React, { useEffect, useRef, useState } from "react";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import styled from "styled-components";

// Create a styled component
const EditButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 200px;
  margin-bottom: 20px;
  border-radius: 5px;
  &:hover {
    background-color: lightgray;
  }
`;
const Heading = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #fff;
`;
const Description = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #fff;
`;
const BackColor = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  color: #202020;
  background-color: #fff;
  padding: 10px 5px;
  border-radius: 10px;
  width: 180px;
  align-items: center;
  justify-content: center;
`;
const ColorBox = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50px;
  margin-left: 5px;
  border: 2px solid #fff;
`;
const MainImage = styled.div`
  width: 300px;
  max-height: 210px;
  overflow: hidden;
  img {
    width: 100%;
  }
`;
const MainBannerBox = styled.div`
  margin: 20px 0px 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const BannerBox = styled.div`
  width: 100%;
  margin: 20px 0px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 11px 6px #00000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const LeftContent = styled.div`
  padding: 30px;
`;

const UIInnerSections = () => {
  const fileInputRef = useRef(null);
  const [uiSections, setUiSections] = useState(null);
  const [filteredUISection, setFilteredUiSection] = useState({});
  const [show, setShow] = useState(false);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [remarks, setRemarks] = useState("");
  const [color, setColor] = useState("");
  const [slug, setSlug] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = () => {
    let data = new FormData();
    data.append("ui_image", image);
    data.append("slug", slug);
    data.append("heading", heading);
    data.append("category_id", filteredUISection.category_id);
    data.append("sub_category_id", filteredUISection.sub_category_id);
    data.append("description", description);
    data.append("color", color);
    data.append("status", "active");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/ui_inner_section/add_ui_inner_sections`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getUISections();
        handleClose();
        toast.success("Data updated");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const handleEditUISection = (values) => {
    setFilteredUiSection(values);
    setHeading(values.heading);
    setDescription(values.description);
    setSlug(values.slug);
    setColor(values.color);
    setRemarks(values.remarks);
    handleShow();
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const getUISections = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/ui_inner_section/get_data`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        setUiSections(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUISections();
  }, []);

  return (
    <div>
      {uiSections &&
        uiSections.map((val) => (
          <MainBannerBox key={val.position}>
            <BannerBox
              style={{
                backgroundColor: val?.color || "#fff",
              }}
            >
              <LeftContent>
                <Heading>
                  Heading:
                  {val?.heading}
                </Heading>
                <Description>
                  Description:
                  {val?.description}
                </Description>
                {/* <div>
                  Slug:
                  {val?.slug}
                </div> */}
                <BackColor>
                  Background Color:
                  <ColorBox
                    style={{
                      backgroundColor: val?.color || "#fff",
                    }}
                  ></ColorBox>
                </BackColor>
              </LeftContent>

              {val?.image && (
                <MainImage
                  style={{ cursor: "pointer" }}
                  onClick={handleImageClick}
                >
                  <img
                    src={`${environmentVariables?.apiUrl}uploads/ui/${val?.image}`}
                    alt={val?.module_heading}
                  />
                </MainImage>
              )}
            </BannerBox>
            <EditButton onClick={() => handleEditUISection(val)}>
              Edit Banner
            </EditButton>
            <input type="file" style={{ display: "none" }} ref={fileInputRef} />
          </MainBannerBox>
        ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Inner Sections</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Heading</Form.Label>
              <Form.Control
                value={heading}
                type="text"
                placeholder=""
                autoFocus
                onChange={(e) => setHeading(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                as="textarea"
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                value={slug}
                placeholder="/sunglasses-men"
                autoFocus
                onChange={(e) => setSlug(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Image</Form.Label>
              <Form.Control
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Background Color:</Form.Label>
              <Form.Control
                onChange={(e) => setColor(e.target.value)}
                type="color"
                value={color}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Remarks (optional)</Form.Label>
              <Form.Control
                onChange={(e) => setRemarks(e.target.value)}
                value={remarks}
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UIInnerSections;
