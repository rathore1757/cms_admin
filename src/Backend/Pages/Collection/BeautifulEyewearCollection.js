import axios from "axios";
import React, { useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";
const BeautifulEyewearCollection = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [collectionData, setCollectionData] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const handleSubmit = () => {
    let data = new FormData();
    data.append("name", name);
    data.append("slug", slug);
    data.append("collection_img", image);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/collection/add_beautiful_eyewear?id=${collectionId}`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getCollectionData();
        setCollectionId(null);
        handleClose();
        toast.success("Data Added ");
      })
      .catch((error) => {
        setCollectionId(null);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const handleAddCollection = () => {
    setName("");
    setSlug("");
    setImage("");
    handleShow();
  };
  const handleEditCollection = (val) => {
    setName(val?.name);
    setCollectionId(val?.id);
    setSlug(val?.slug);
    setImage("");
    handleShow();
  };
  const handleDeleteCollection = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      confirmButtonText: "Delete it",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: `${environmentVariables?.apiUrl}api/admin/collection/delete_beautiful_eyewear/${id}`,
          withCredentials: true,
        };

        axios
          .request(config)
          .then((response) => {
            getCollectionData();
            toast.success("deleted successfully");
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message);
          });
      }
    });
  };
  const getCollectionData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/collection/get_beautiful_eyewear`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setCollectionData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCollectionData();
  }, []);
  return (
    <div>
      <div>
        <button onClick={handleAddCollection}>Add +</button>
      </div>
      <>
        {collectionData &&
          collectionData.map((val) => (
            <div>
              <div>
                <strong>Name: </strong>
                {val?.name}
              </div>
              <div>
                <strong>Slug: </strong>
                {val?.slug}
              </div>
              <div>
                <img
                  src={`${environmentVariables?.apiUrl}uploads/ui/${val?.image}`}
                />
              </div>
              <div>
                <button onClick={() => handleDeleteCollection(val?.id)}>
                  delete
                </button>
                <button onClick={() => handleEditCollection(val)}>Edit</button>
              </div>
            </div>
          ))}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Collection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={name}
                  type="text"
                  placeholder="Enter Name"
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Slug</Form.Label>
                <Form.Control
                  value={slug}
                  type="text"
                  placeholder="Enter Slug"
                  onChange={(e) => setSlug(e.target.value)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
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
      </>
    </div>
  );
};

export default BeautifulEyewearCollection;
