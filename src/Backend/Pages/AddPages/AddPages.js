import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import CircularLoader from "../../Components/CircularLoader/CircularLoader";
import Swal from "sweetalert2";

const AddPages = () => {
  const [isContentAvailable, setIsContentAvailable] = useState(false);
  const [citiesList, setCitiesList] = useState(null);
  const [title, setTitle] = useState("");
  const onHide = () => setModalShow(false);
  const onShowModal = () => setModalShow(true);
  const [modalShow, setModalShow] = useState(false);
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [metaTags, setMetaTags] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getCitiesList();
  }, []);
  const handleOpenSaveModal = () => {
    if (!title || title == null || title == undefined || title.trim() == "") {
      toast.error("Title is required");
    } else if (
      !description ||
      description == null ||
      description == undefined ||
      description.trim() == ""
    ) {
      toast.error("Description is required");
    } else if (
      !content ||
      content == null ||
      content == undefined ||
      content.trim() == ""
    ) {
      toast.error("Content is required");
    } else if (
      !metaTags ||
      metaTags == null ||
      metaTags == undefined ||
      metaTags.trim() == ""
    ) {
      toast.error("Meta Tags are required");
    } else if (
      !metaDesc ||
      metaDesc == null ||
      metaDesc == undefined ||
      metaDesc.trim() == ""
    ) {
      toast.error("Meta Description is required");
    } else {
      onShowModal();
    }
  };
  const getCitiesList = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:2000/api/user/blog/feth_city",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response?.data?.data);
        setCitiesList(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const generateAutoForCities = () => {
    let config1 = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:2000/api/user/blog/generate_data_for_cities",
      headers: {},
    };

    axios
      .request(config1)
      .then((response) => {
        toast.success("Started Auto generation");
      })
      .catch((error) => {
        toast.success("Data saved");
        toast.warning("Auto generation of data for other city failed");
      });
  };
  const saveKeywordsAndSubmit = () => {
    let data = {
      title: title,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:2000/api/user/blog/save_keywords",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        generateAutoForCities();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmitContent = (generateAuto) => {
    if (generateAuto == true) {
      saveKeywordsAndSubmit();
    }
    setIsLoading(true);
    let data = {
      title: title,
      slug: slug,
      description: description,
      content: content,
      meta_tag: metaTags,
      meta_description: metaDesc,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:2000/api/user/blog/add_content",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        toast.success("Data Saved Successfully");
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const generateContent = () => {
    if (!title || title == null || title == undefined || title.trim() == "") {
      toast.error("title is required");
      return;
    }
    setIsLoading(true);
    let data = {
      title: title,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:2000/api/user/blog/generate_content",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setContent(response?.data?.data?.content);
        setDescription(response?.data?.data?.description);
        setMetaTags(response?.data?.data?.meta_tag);
        setMetaDesc(response?.data?.data?.meta_description);
        setIsContentAvailable(true);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(
          "Auto generation failed because of too many request please try again"
        );
        console.log(error);
      });
  };
  const handleChangeTitle = (e) => {
    let value = e.target.value;
    setTitle(value);
    let newslug = `${value.trim().split(" ").join("-")}`;
    setSlug(newslug);
  };
  const handleChangeImage = (e) => {
    console.log(e.target.files[0]);
  };
  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Title</Form.Label>{" "}
          <Form.Control
            value={title}
            onChange={handleChangeTitle}
            placeholder="Enter Title"
            type="text"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Slug</Form.Label>{" "}
          <Form.Control value={slug} disabled placeholder="slug" type="text" />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Image</Form.Label>{" "}
          <Form.Control onChange={handleChangeImage} type="file" />
        </Form.Group> */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={generateContent}>
            {isLoading == true ? (
              <>
                <CircularLoader size={20} />
              </>
            ) : (
              "Generate Content Automatically"
            )}
          </Button>
          <Button onClick={() => setIsContentAvailable(true)}>
            Enter Manually
          </Button>
        </div>
        {isContentAvailable == true ? (
          <>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Description</Form.Label>{" "}
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Content</Form.Label>{" "}
              <Form.Control
                as="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Enter Content"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Meta Tags</Form.Label>{" "}
              <Form.Control
                value={metaTags}
                onChange={(e) => setMetaTags(e.target.value)}
                placeholder="enter meta tags"
                type="text"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Meta Description</Form.Label>{" "}
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Meta Description"
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
              />
            </Form.Group>
            <Button
              // onClick={handleSubmitContent}
              onClick={handleOpenSaveModal}
            >
              {isLoading == true ? (
                <>
                  <CircularLoader size={20} />
                </>
              ) : (
                "Save"
              )}
            </Button>
          </>
        ) : (
          <></>
        )}
      </Form>
      <Modal
        show={modalShow}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Generate Content Automatically
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you want to generate content for the following keywords?</h4>
          <ul style={{ height: "200px", overflow: "scroll" }}>
            {citiesList &&
              citiesList.length > 0 &&
              citiesList.map((val) => <li>{`${title} in ${val?.city}`}</li>)}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleSubmitContent(false)}>No</Button>
          <Button onClick={() => handleSubmitContent(true)}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddPages;
