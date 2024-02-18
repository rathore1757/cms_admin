import axios from "axios";
import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import CircularLoader from "../../Components/CircularLoader/CircularLoader";
import Swal from "sweetalert2";
const AddPages = () => {
  const [isContentAvailable, setIsContentAvailable] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [metaTags, setMetaTags] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmitContent = () => {
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
        let config1 = {
          method: "post",
          maxBodyLength: Infinity,
          url: "http://localhost:2000/api/user/blog/generate_data_for_cities",
          headers: {},
        };

        axios
          .request(config1)
          .then((response) => {
            toast.success("Data saved successfully");
          })
          .catch((error) => {
            toast.success("Data saved");
            toast.warning("Auto generation of data for other city failed");
          });
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
            <Button onClick={handleSubmitContent}>
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
    </div>
  );
};

export default AddPages;
