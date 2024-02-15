import React, { useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";
import { Image } from "@material-ui/icons";
import { toast } from "react-toastify";
import styled from "styled-components";

// Create a styled component
const Addbutton = styled.button`
  padding: 15px 20px;
  border: 0;
  background-color: #032140;
  color: #fff;
  cursor: pointer;
  width: 250px;
  margin-bottom: 50px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 500;
  &:hover {
    background-color: #032160;
  }
`;
const Heading = styled.div`
  font-size: 30px;
  color: #032140;
  font-weight: 700;
  margin-bottom: 20px;
`;
const BigImage = styled.div`
  width: 300px;
  img {
    width: 100%;
  }
`;
const ProduvtImage = styled.div`
  width: 280px;
  img {
    width: 100%;
  }
`;
const EditButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 200px;
  margin-bottom: 50px;
  border-radius: 5px;
  &:hover {
    background-color: lightgray;
  }
`;
const VarientName = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #4d4d4d;
`;
const ProductBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
`;
const SingleProductBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BestSeller = () => {
  const [bestSellerData, setBestSellerData] = useState(null);
  const [fashionTrendData, setFashionTrendData] = useState(null);
  const [show, setShow] = useState(false);
  const [type, setType] = useState("");
  const [image, setImage] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [productId, setProductId] = useState();
  const [productVariantId, setProductVariantId] = useState();
  const [allProducts, setAllProducts] = useState(null);
  const [productData, setProductData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [position, setPosition] = useState(0);
  const resetData = () => {
    setProductId("");
    setProductVariantId("");
    setPosition(0);
    setType("");
  };
  const handleEditBestSeller = (val) => {
    setIsEdit(true);
    setType(val?.type);
    setProductId(val?.product_id);
    const filterProduct = allProducts.filter(
      (value) => value.id == val.product_id
    );
    setProductData(filterProduct[0]?.variants);
    setProductVariantId(val?.variant_id);
    handleShow();
  };
  const handleChangeProduct = (e) => {
    setProductId(e.target.value);
    const filteredProduct = allProducts.filter(
      (val) => val.id == e.target.value
    );
    // setPosition(val?.position);
    setProductData(filteredProduct[0]?.variants);
  };
  const getAllProducts = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/product/fetch_all_product_admin`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data.data);
        setAllProducts(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = () => {
    let position1;
    if (isEdit) {
      position1 = position;
    } else {
      position1 =
        type == "best_seller"
          ? bestSellerData.length + 1
          : fashionTrendData.length + 1;
    }
    let data = new FormData();
    data.append("product_id", productId);
    data.append("variant_id", productVariantId);
    data.append("position", position1);
    data.append("type", type);
    data.append("status", "active");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/best_seller/add`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getAllData();
        handleClose();
        setIsEdit(false);
        toast.success("Data added");
      })
      .catch((error) => {
        setIsEdit(false);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const handleChangeType = (e) => {
    setType(e.target.value);
  };
  const getAllData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/best_seller/get`,
      withCredentials: true,
    };
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.data) {
          const filteredBestSeller = response.data.data.filter(
            (val) => val.type === "best_seller"
          );
          const filteredFashionTrends = response.data.data.filter(
            (val) => val.type === "fashion_trend"
          );
          setBestSellerData(filteredBestSeller);
          setFashionTrendData(filteredFashionTrends);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllData();
    getAllProducts();
  }, []);
  return (
    <div>
      <Addbutton
        onClick={() => {
          handleShow();
          setIsEdit(false);
          resetData();
        }}
      >
        + Add New Product
      </Addbutton>
      <div>
        <Heading>Best Sellers</Heading>
        <ProductBox>
          {bestSellerData &&
            bestSellerData.map((val) => (
              <>
                <SingleProductBox>
                  {val?.image && (
                    <BigImage>
                      <img
                        src={`${environmentVariables?.apiUrl}uploads/bestSeller/${val?.image}`}
                      />
                    </BigImage>
                  )}
                  <ProduvtImage>
                    <img
                      src={`${environmentVariables?.apiUrl}uploads/${val?.thumbnail_url}`}
                    />
                  </ProduvtImage>
                  <VarientName>
                    <strong>Variant Name: </strong>
                    {val?.variant_name}
                  </VarientName>
                  <EditButton onClick={() => handleEditBestSeller(val)}>
                    Edit
                  </EditButton>
                </SingleProductBox>
              </>
            ))}
        </ProductBox>

        <Heading>Fashion Trends</Heading>
        <ProductBox>
          {fashionTrendData &&
            fashionTrendData.map((val) => (
              <>
                <SingleProductBox>
                  <ProduvtImage>
                    <img
                      src={`${environmentVariables?.apiUrl}uploads/${val?.thumbnail_url}`}
                    />
                  </ProduvtImage>
                  <VarientName>
                    <strong>Variant Name: </strong>
                    {val?.variant_name}
                  </VarientName>
                  <EditButton onClick={() => handleEditBestSeller(val)}>
                    Edit
                  </EditButton>
                </SingleProductBox>
              </>
            ))}
        </ProductBox>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEdit
                ? `Edit ${
                    type == "best_seller" ? "Best Seller" : "Fashion Trend"
                  }`
                : "Add Data"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Heading</Form.Label>
                <Form.Control
                  value={heading}
                  type="text"
                  placeholder=""
                  autoFocus
                  onChange={(e) => setHeading(e.target.value)}
                />
              </Form.Group> */}
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Add Type</Form.Label>
                <Form.Select value={type} onChange={handleChangeType}>
                  <option value="" disabled selected>
                    Select Type
                  </option>
                  <option value={`best_seller`}>Best Seller</option>
                  <option value={`fashion_trend`}>Fashion Trends</option>
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Add Product</Form.Label>
                <Form.Select value={productId} onChange={handleChangeProduct}>
                  <option value="" disabled selected>
                    Select Product
                  </option>
                  {allProducts &&
                    allProducts.map((val) => (
                      <option value={val?.id}>{val?.title}</option>
                    ))}
                </Form.Select>
                <Form.Select
                  value={productVariantId}
                  onChange={(e) => setProductVariantId(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select Product Variant
                  </option>
                  {productData &&
                    productData.map((val) => (
                      <option value={val?.variant_id}>
                        {val?.variant_name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              {type == "best_seller" ? (
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Add Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </Form.Group>
              ) : (
                <></>
              )}
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
    </div>
  );
};

export default BestSeller;
