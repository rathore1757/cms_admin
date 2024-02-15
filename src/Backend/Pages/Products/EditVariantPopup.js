import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import { AddVariantSchema } from "./../../../common/VariantSchema/variantSchema";
import { useFormik } from "formik";
import { AddCountryInVariantSchema } from "../../../common/VariantSchema/AddCountyInVariantSchema";

const EditVariantPopup = ({
  open,
  setOpen,
  categoryData,
  countryData,
  productId,
  varaintId,
  variantData,
  setUpdatedState,
  updatedState,
}) => {
  console.log(variantData, "categoryData");

  const initialValues = {
    // country: variantData?.,
    stock: variantData?.stock || 0,
    price: variantData?.price || 0,
    discount: variantData?.discount || 0,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddCountryInVariantSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(
        "colorValue",
        productId,
        values,
        varaintId?.variant_id,
        variantData
      );

      let data = {
        variant_id: varaintId?.variant_id?.toString(),
        country_code: variantData?.country_code,
        price: values?.price?.toString(),
        stock: values?.stock?.toString(),
        discount: values?.discount?.toString(),
        status: "active",
      };

      let config = {
        method: "put",
        url: `${environmentVariables?.apiUrl}api/admin/product/add_country_data`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setUpdatedState(!updatedState);
          setOpen(false);
          resetForm({});
          toast.success("New Variant Added Successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.response?.data?.message || error?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });

      // let data = {
      //   variant_id: variantData?.variant_id?.toString(),
      //   country: countryName,
      //   country_code: values?.country,
      //   price: values?.price?.toString(),
      //   stock: values?.stock?.toString(),
      //   discount: values?.discount?.toString(),
      //   currency_symbol: countrySymbol,
      //   status: "active",
      // };

      // let config = {
      //   method: "post",
      //   url: `${environmentVariables?.apiUrl}api/admin/product/add_country_data`,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data: data,
      // };

      // axios
      //   .request(config)
      //   .then((response) => {
      //     console.log(JSON.stringify(response.data));
      //     setUpdatedState(!updatedState);
      //     setOpen(false);
      //     resetForm({});
      //     toast.success("New Variant Added Successfully");
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     toast.error(error?.response?.data?.message || error?.message, {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });
      //   });

      //   let data = new FormData();
      //   data.append("color_id", values.colorValue);
      //   data.append("product_id", productId);

      //   let config = {
      //     method: "post",
      //     maxBodyLength: Infinity,
      //     url: `${environmentVariables?.apiUrl}api/admin/product/add_product_variant`,

      //     data: data,
      //   };

      //   axios
      //     .request(config)
      //     .then((response) => {
      //       console.log(JSON.stringify(response.data));
      //       setUpdatedState(!updatedState);
      //       setOpen(false);
      //       toast.success("New Variant Added Successfully");
      //     })
      //     .catch((error) => {
      //       toast.error(error?.response?.data?.message || error?.message, {
      //         position: toast.POSITION.TOP_RIGHT,
      //       });
      //     });
    },
  });

  const { values, errors, handleSubmit } = formik;
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Pricing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.stock && formik.errors.stock ? (
              <div style={{ color: "red" }}>{formik.errors.stock}</div>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price ? (
              <div style={{ color: "red" }}>{formik.errors.price}</div>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Discount</Form.Label>
            <Form.Control
              type="number"
              name="discount"
              value={values.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.discount && formik.errors.discount ? (
              <div style={{ color: "red" }}>{formik.errors.discount}</div>
            ) : null}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditVariantPopup;
