import React, { useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@material-ui/icons/ArrowDownward";
import DatePicker from "react-datepicker";
import "react-data-table-component-extensions/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";

import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
const Orders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [show, setShow] = useState(false);
  const [countries, setCountries] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState();
  const [shippingDate, setShippingDate] = useState();
  const [filterOption, setFilterOption] = useState();
  const [outForDeliveryDate, setOutForDeliveryDate] = useState();
  const [orderId, setOrderId] = useState();
  const [country, setCountry] = useState("");
  const navigate = useNavigate(null);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const resetFilterData=()=>{
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCountry('');
    setFilterOption('')
  }
  const handleSubmit = () => {
    let data = {
      order_id: orderId,
      delivery_date: deliveryDate,
      shipping_date: shippingDate,
      out_for_delivery_date: outForDeliveryDate,
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/order/update_delivery_date`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        handleClose();
        setOrderId("");
        setDeliveryDate("");
        setOutForDeliveryDate("");
        setShippingDate("");
        getAllOrders();
        toast.success("Dates updated");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const handleEditOrder = (value) => {
    setDeliveryDate(value.delivery_date);
    setOrderId(value.order_id);
    setOutForDeliveryDate(value.out_for_delivery_date);
    setShippingDate(value.shipping_date);
    handleShow();
  };
  const columns = [
    {
      name: "Order id",
      selector: (row) => row.order_id,
    },
    {
      name: "Buyer Name",
      selector: (row) => row.user.name,

      width: "150px",
    },
    {
      name: "Subtotal",
      selector: (row) => row.sub_total,

      width: "80px",
    },
    {
      name: "Payment Method",
      selector: (row) => row.payment_method,
    },
    {
      name: "Payment Status",
      selector: (row) => row.payment_status,
    },
    {
      name: "Txn Id",
      selector: (row) => row.txn_id,
    },
    {
      name: "Order Status",
      selector: (row) => row.status,
    },
    {
      name: "Order Date",
      selector: (row) => row.order_date,
      cell: (d) => {
        const dateObj = new Date(d.order_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Delivery Date",
      selector: (row) => row.delivery_date,
      cell: (d) => {
        const dateObj = new Date(d.delivery_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Shipping Date",
      selector: (row) => row.shipping_date,
      cell: (d) => {
        const dateObj = new Date(d.shipping_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Out for delivery Date",
      selector: (row) => row.out_for_delivery_date,
      cell: (d) => {
        const dateObj = new Date(d.out_for_delivery_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Delivery Instructions",
      selector: (row) => row.delivery_instructions,
    },
    {
      name: "Zipcode",
      selector: (row) => row.user_address.zipcode,
    },
    {
      name: "Actions",
      sortable: false,
      cell: (d) => (
        <>
          <i
            onClick={() => handleEditOrder(d)}
            style={{ width: "50px", cursor: "pointer" }}
            className="fas fa-pen"
          ></i>
          <i
            onClick={() => navigate(`/orders/${d.order_id}`)}
            style={{ width: "50px", cursor: "pointer" }}
            className="fas fa-eye"
          ></i>
        </>
      ),
    },
  ];

  const tableData = { columns, data: ordersData };

  const tableExtensions = {
    export: false,
    print: false,
  };
  const getCountries = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/get_active`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setCountries(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllOrders = () => {
    let filters = "?";
    if (filterOption == "today") {
      filters = "?today=true&";
    } else if (filterOption == "week") {
      filters = "?this_week=true&";
    } else if (filterOption == "month") {
      filters = "?this_month=true&";
    } else if (filterOption == "year") {
      filters = "?this_year=true&";
    }
    if (country !== "") {
      filters += `country_code=${country}&`;
    }
    if (startDateFilter !== null && endDateFilter !== null) {
      filters += `start_date=${startDateFilter}&end_date=${endDateFilter}`;
    }
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/order/get_filtered_orders${filters}`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data.data);
        setOrdersData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCountries();
  }, []);
  useEffect(() => {
    getAllOrders();
  }, [filterOption, country, startDateFilter, endDateFilter]);
  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <h4>Filters</h4>

        <ButtonGroup>
          <ToggleButton
            onClick={() => setFilterOption("today")}
            style={
              filterOption === "today"
                ? { backgroundColor: "white", color: "black" }
                : {}
            }
          >
            Today
          </ToggleButton>
          <ToggleButton
            onClick={() => setFilterOption("week")}
            style={
              filterOption === "week"
                ? { backgroundColor: "white", color: "black" }
                : {}
            }
          >
            This Week
          </ToggleButton>
          <ToggleButton
            onClick={() => setFilterOption("month")}
            style={
              filterOption === "month"
                ? { backgroundColor: "white", color: "black" }
                : {}
            }
          >
            This Month
          </ToggleButton>
          <ToggleButton
            onClick={() => setFilterOption("year")}
            style={
              filterOption === "year"
                ? { backgroundColor: "white", color: "black" }
                : {}
            }
          >
            This Year
          </ToggleButton>
        </ButtonGroup>
      </div>
      <div className="d-flex gap-3 mt-3">
        <div>
          <Form.Select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option disabled selected value="">
              Select Country
            </option>
            {countries &&
              countries.map((val) => (
                <option
                  style={{ textTransform: "capitalize" }}
                  value={val?.country_code}
                >
                  {val?.country}
                </option>
              ))}
          </Form.Select>
        </div>
        <div className="d-flex align-items-center">
          <DatePicker
            selected={startDateFilter}
            onChange={(date) => setStartDateFilter(date)}
            className="form-control"
            placeholderText="start date"
          />
          <DatePicker
            selected={endDateFilter}
            onChange={(date) => setEndDateFilter(date)}
            className="form-control"
            placeholderText="end date"
          />
        </div>
        <div>
          <Button onClick={resetFilterData}>Reset</Button>
        </div>
      </div>

      <div>
        <h4>Orders</h4>
        <DataTableExtensions
          {...tableExtensions}
          {...tableData}
          filterPlaceholder="Search Orders"
        >
          <DataTable
            columns={columns}
            data={ordersData}
            noHeader
            defaultSortField="id"
            sortIcon={<SortIcon />}
            defaultSortAsc={true}
            pagination
            highlightOnHover
          />
        </DataTableExtensions>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Shipping Date</Form.Label>
              <Form.Control
                value={shippingDate}
                onChange={(e) => setShippingDate(e.target.value)}
                type="Date"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Out For Delivery Date</Form.Label>
              <Form.Control
                value={outForDeliveryDate}
                onChange={(e) => setOutForDeliveryDate(e.target.value)}
                type="Date"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Delivery Date</Form.Label>
              <Form.Control
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                type="Date"
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

export default Orders;
