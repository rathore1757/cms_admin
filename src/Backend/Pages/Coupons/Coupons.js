import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@material-ui/icons/ArrowDownward";
import "react-data-table-component-extensions/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import countryCodes from "../../../common/countryCodes";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
const Coupons = () => {
  const handleEditCoupon = (val) => {
    setCountryCode(val?.country);
    const filterCountry = countryCodes.filter(
      (value) => value?.code == val?.country
    );
    setCountry(filterCountry[0]?.name);
    setCouponName(val?.name);
    setCouponType(val?.type);
    setCouponCode(val?.code);
    setCouponValue(val?.value);
    setStartDate(val?.start_date);
    setExpiryDate(val?.expired_date);
    setLimit(val?.limit);
    setMinPurchase(val?.min_purchase);
    setMaxPurchase(val?.max_purchase);
    handleShow();
  };
  const resetData = () => {
    setCountry("");
    setCountryCode("");
    setCouponName("");
    setCouponType("");
    setCouponCode("");
    setCouponValue("");
    setStartDate("");
    setExpiryDate("");
    setMinPurchase("");
    setMaxPurchase("");
    setLimit("");
  };
  const handleSubmit = () => {
    let data = {
      name: couponName,
      code: couponCode,
      value: couponValue,
      start_date: startDate,
      expired_date: expiryDate,
      min_purchase: minPurchase,
      max_purchase: maxPurchase,
      limit: `${limit}`,
      country: countryCode,
      type: couponType,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/coupons/add_coupons`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getAllCoupons();
        resetData();
        toast.success("Coupon Added");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const handleDeleteCoupon = (id) => {
    Swal.fire({
      title: "Are you sure, you want to delete it?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: `${environmentVariables?.apiUrl}api/admin/coupons/delete_coupon_by_id?id=${id}`,
          withCredentials: true,
        };

        axios
          .request(config)
          .then((response) => {
            getAllCoupons();
            toast.success("Deleted successfully");
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message);
          });
      }
    });
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      width: "150px",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: "80px",
    },
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      sortable: true,
      cell: (d) => {
        const dateObj = new Date(d.start_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Expiry Date",
      selector: (row) => row.expired_date,
      sortable: true,
      cell: (d) => {
        const dateObj = new Date(d.expired_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Min Purchase",
      selector: (row) => row.min_purchase,
      sortable: true,
    },
    {
      name: "Max Purchase",
      selector: (row) => row.max_purchase,
      sortable: true,
    },
    {
      name: "Limit",
      selector: (row) => row.limit,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name: "Actions",
      sortable: false,
      cell: (d) => (
        <>
          {" "}
          <i
            style={{ width: "50px", cursor: "pointer" }}
            onClick={() => handleEditCoupon(d)}
            className="fas fa-pen"
          ></i>
          <i
            style={{ width: "50px", cursor: "pointer" }}
            onClick={() => handleDeleteCoupon(d.id)}
            className="fas fa-trash"
          ></i>
        </>
      ),
    },
  ];

  const tableExtensions = {
    export: false,
    print: false,
  };
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [country, setCountry] = useState("");
  const [couponName, setCouponName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("");
  const [couponValue, setCouponValue] = useState("");
  const [startDate, setStartDate] = useState();
  const [expiryDate, setExpiryDate] = useState();
  const [minPurchase, setMinPurchase] = useState();
  const [maxPurchase, setMaxPurchase] = useState();
  const [limit, setLimit] = useState();
  const [countryCode, setCountryCode] = useState("");
  const handleClose = () => setShow(false);
  const tableData = { columns, data: data };
  const handleChangeCountry = (e) => {
    setCountry(e.target.value);
    const countryCode = countryCodes.filter(
      (val) => val?.name == e.target.value
    );
    setCountryCode(countryCode[0]?.code);
  };
  const getAllCoupons = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/coupons/get_all_coupons`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data.data, "coupons");
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleAddCoupon = () => {
    handleShow();
  };
  useEffect(() => {
    getAllCoupons();
  }, []);
  return (
    <div>
      <div className="mb-3">
        <button onClick={handleAddCoupon}>Add +</button>
      </div>
      <div>
        <h4>Coupons</h4>
        <DataTableExtensions
          {...tableExtensions}
          {...tableData}
          filterPlaceholder="Search Coupons"
        >
          <DataTable
            columns={columns}
            data={data}
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
          <Modal.Title>Add/Update Coupons</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Country</Form.Label>
              <Form.Control type="text" />
            </Form.Group> */}
            <div className="d-flex">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Country</Form.Label>
                <Form.Select value={country} onChange={handleChangeCountry}>
                  <option value="" disabled selected>
                    Select Country
                  </option>
                  {countryCodes.map((val) => (
                    <option value={val?.name}>{val?.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                {countryCodes.map((val) => {
                  if (val?.name === country) {
                    return (
                      <>
                        <Form.Label>Country Code</Form.Label>{" "}
                        <Form.Control disabled value={val?.code} type="text" />
                      </>
                    );
                  }
                })}
              </Form.Group>
            </div>
            <div className="d-flex">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={couponName}
                  onChange={(e) => setCouponName(e.target.value)}
                  type="text"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Code</Form.Label>
                <Form.Control
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  type="text"
                />
              </Form.Group>
            </div>
            <div className="d-flex">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Type</Form.Label>
                <Form.Select
                  onChange={(e) => setCouponType(e.target.value)}
                  value={couponType}
                >
                  <option value="" disabled selected>
                    Select Type
                  </option>
                  <option value="fixed">Fixed</option>
                  <option value="percent">Percent Age</option>
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Value</Form.Label>
                <Form.Control
                  value={couponValue}
                  onChange={(e) => setCouponValue(e.target.value)}
                  type="text"
                />
              </Form.Group>
            </div>
            <div className="d-flex">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  type="date"
                />
              </Form.Group>
            </div>
            <div className="d-flex">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Minimum Purchase</Form.Label>
                <Form.Control
                  value={minPurchase}
                  onChange={(e) => setMinPurchase(e.target.value)}
                  type="text"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Maximum Purchase</Form.Label>
                <Form.Control
                  value={maxPurchase}
                  onChange={(e) => setMaxPurchase(e.target.value)}
                  type="text"
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Limit</Form.Label>
              <Form.Control
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                type="text"
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

export default Coupons;
