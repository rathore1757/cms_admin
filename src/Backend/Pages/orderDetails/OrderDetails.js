import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
const OrderDetails = () => {
  const { orderid } = useParams();
  const [ordersData, setOrdersData] = useState(null);
  const [show, setShow] = useState(false);
  const handleSubmit = () => {
    let data = {
      order_id: orderid,
      status: orderStatus,
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/order/update_order_status`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getOrderDetail();
        handleClose();
        toast.success("Order Status Changed");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [orderStatus, setOrderStatus] = useState("");
  const handleChangeOrderStatus = () => {
    handleShow();
  };
  const getOrderDetail = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/order/get_all`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.data) {
          const filterorderdata = response.data.data.filter(
            (val) => val.order_id == orderid
          );
          setOrdersData(filterorderdata[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getOrderDetail();
  }, []);

  return (
    <div>
      {ordersData && (
        <div>
          <div>
            <strong>Order Id:</strong>
            {ordersData.order_id}
          </div>
          <div>
            <strong>Products: </strong>
            <>
              {ordersData.variant_quantity.map((val) => (
                <>
                  <div>
                    <strong>Name: </strong>
                    {val?.variant_name}
                  </div>
                  <div>
                    <img
                      src={`${environmentVariables?.apiUrl}uploads/${val?.thumbnail_url}`}
                    />
                  </div>
                </>
              ))}
            </>
          </div>
          <div>
            <strong>Sub Total: </strong>
            {ordersData?.sub_total}
          </div>
          <div>
            <strong>Payment Method: </strong>
            {ordersData?.payment_method}
          </div>
          <div>
            <strong>Payment Status: </strong>
            {ordersData?.payment_status}
          </div>
          <div>
            <strong>Order Status: </strong>
            {ordersData?.status}
          </div>
          <div>
            <strong>Transaction Id: </strong>
            {ordersData?.txn_id}
          </div>
          <div>
            <strong>Order Date: </strong>
            {ordersData?.order_date.split("T")[0]}
          </div>
          <div>
            <strong>Delivery Date: </strong>
            {ordersData?.delivery_date.split("T")[0]}
          </div>
          <div>
            <strong>Shipping Date: </strong>
            {ordersData?.shipping_date.split("T")[0]}
          </div>
          <div>
            <strong>Out for Delivery Date: </strong>
            {ordersData?.out_for_delivery_date.split("T")[0]}
          </div>
          <div>
            <strong>Buyer Name: </strong>
            {ordersData?.userObj?.name}
          </div>
          <div>
            <strong>Buyer Address: </strong>
            {ordersData?.userAddressObj?.city}
          </div>
          <button
            disabled={ordersData?.status !== "new"}
            onClick={handleChangeOrderStatus}
          >
            Change Order Status
          </button>
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add/Update Coupons</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Country</Form.Label>
              <Form.Select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <option value="" disabled selected>
                  Select Order Status
                </option>
                <option value="outfordelivery">Out for Delivery</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
              </Form.Select>
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

export default OrderDetails;
