import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Form } from "react-bootstrap";
import axios from "axios";
import { environmentVariables } from "../../../config/env.config";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
const FormFileInput = styled.input`
  width: 100%;
  border-radius: 5px;
  height: 30px;
  margin: 10px 0 20px 0;
  border: 1px solid #c4c4c4;
`;
const ImageSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const ImageWrapper = styled.div`
  position: relative;
`;
const Image1 = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
`;
const CirleCross = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  background-color: green; /* Adjust the background color as needed */
  border-radius: 50%;
  z-index: -1;
`;
const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  // background: transparent;
  border: none;
  color: red;
  cursor: pointer;
`;
const ViewVariants = () => {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  // const fetchProductVariantById = async () => {
  //   const response = await axios.get(
  //     `${environmentVariables?.apiUrl}api/admin/product/fetch_product_variant_by_id?id=${id}`,
  //     {
  //       withCredentials: true,
  //     }
  //   );

  //   return response?.data?.data;
  // };

  // const { data, isLoading, error, refetch } = useQuery(
  //   "variantbyid",
  //   fetchProductVariantById
  // );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  console.log("idd", data);
  const [thumbnail, setThumbNail] = useState();
  const [status, setStatus] = useState();

  const [images, setImages] = useState([]);
  const updateProductVariant = () => {

    let data = new FormData();
    data.append("variant_id", id);
    data.append("variant_image", thumbnail);
    data.append("status", status);

    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/product/edit_product_variant`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getProductVariantById();
        toast.success("Variant Updated Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };

  const getProductVariantById = () => {
    setLoading(true);
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/product/fetch_product_variant_by_id?id=${id}`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setData();
      });
  };

  useEffect(() => {
    getProductVariantById();
  }, [id]);
  useEffect(() => {
    if (data) {
      setThumbNail(data?.thumbnail_url);
      setStatus(data?.status);
      // setVariantName(data?.variant_name);
      // setPrice(data?.variant_price_details?.[0]?.price);
      // setStock(data?.variant_price_details?.[0]?.stock);
      // setDiscount(data?.variant_price_details?.[0]?.discount);
      setImages(data?.variantImageObj?.images);
    }
  }, [data]);
  const MultipleFileChange = (e) => {
    const formdata = new FormData();
    // for (let i = 0; i < e.target.files.length; i++) {
    //   formdata.append("variant_image_Arr", e.target.files[i]);
    // }
    for (const file of e.target.files) {
      formdata.append("variant_image_Arr", file);
    }
    formdata.append("variant_id", id);
    formdata.append("product_id", data?.product_id);
    // console.log(data?.product_id, id, e.target.files);

    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/product/add_product_variant_Images`,
      withCredentials: true,
      data: formdata,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getProductVariantById();
        toast.success("Variant Updated Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };

  const removeImage = async (imageName) => {
    let data = {
      variant_id: id,
      variantImageName: imageName,
    };

    let config = {
      method: "put",
      url: `${environmentVariables?.apiUrl}api/admin/product/edit_product_variant_Images`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getProductVariantById();
        toast.success("Variant Updated Successfully");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  if (loading) return <h1>Loading</h1>;
  return (
    <div>
      <div>Variant</div>
      <div>
        {data && (
          <div>
            <img src={`${environmentVariables?.apiUrl}uploads/${thumbnail}`} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbNail(e.target.files[0])}
              ref={fileInputRef}
            />
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Enable/Disable Button"
              checked={status === "active"}
              onChange={handleSwitchChange}
            />
            {/* <input
              type="text"
              value={variantName}
              placeholder="Variant Name"
              onChange={(e) => setVariantName(e.target.value)}
            /> */}
            {/* <input
              type="number"
              value={price}
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              value={stock}
              placeholder="Stock"
              onChange={(e) => setStock(e.target.value)}
            />
            <input
              type="number"
              value={discount}
              placeholder="Dsicount"
              onChange={(e) => setDiscount(e.target.value)}
            /> */}
            <button onClick={() => updateProductVariant()}>
              Update Variant
            </button>
          </div>
        )}
        <div>
          {" "}
          <label>Images*</label>
          <FormFileInput
            type="file"
            multiple
            name="myFiles"
            onChange={(e) => MultipleFileChange(e)}
          />
        </div>

        <ImageSection>
          {images?.map((image) => (
            <ImageWrapper key={image}>
              <CirleCross></CirleCross>
              <Image1
                src={`${environmentVariables?.apiUrl}uploads/${image}`}
                alt="Image"
              />
              <RemoveButton onClick={() => removeImage(image)}>
                delete
                {/* <FaTimes /> */}
              </RemoveButton>
            </ImageWrapper>
          ))}
        </ImageSection>
      </div>
    </div>
  );
};

export default ViewVariants;
