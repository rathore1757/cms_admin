import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@material-ui/icons/ArrowDownward";
import "react-data-table-component-extensions/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import countryCodes from "../../../common/countryCodes.js";
import { Modal, Form, Button } from "react-bootstrap";
const CountryZipcodes = () => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Remove
    </Tooltip>
  );
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState();
  const [zipcodeInput, setZipcodeInput] = useState("");
  const [countryCode, setCountryCode] = useState();
  const [zipcodeArray, setZipCodeArray] = useState([]);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const getAllCountries = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/get`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data, "countriesdata");
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
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
  const handleChangeCountry = (e) => {
    setCountry(e.target.value);
    const countryCode = countryCodes.filter(
      (val) => val?.name == e.target.value
    );
    setCountryCode(countryCode[0]?.code);
  };
  const handleEditCountry = (val) => {
    console.log(val);
    setCountryCode(val?.country_code);
    setCountry(val?.country);
    setZipCodeArray(val?.zipcodes);
    handleShow();
  };
  const handleSubmit = (event) => {
    let data = {
      country_code: countryCode,
      country: country,
      zipcodes: zipcodeArray,
      status: "active",
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/add_zipcodes`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getAllCountries();
        toast.success("Values Added");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const handleChangeStatus = (val) => {
    let data = {
      id: `${val?.id}`,
      status: val?.status == "active" ? "inactive" : "active",
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/edit_status_zipcodes`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getAllCountries();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  useEffect(() => {
    getAllCountries();
  }, []);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setZipCodeArray((prev) => [...prev, zipcodeInput]);
      setZipcodeInput("");
      event.preventDefault();
    }
  };
  const handleRemoveZipCode = (val) => {
    const zipcodefilter = zipcodeArray.filter((value) => value != val);
    setZipCodeArray(zipcodefilter);
  };
  return (
    <div>
      <div className="mb-3">
        <button onClick={handleShow}>Add +</button>
      </div>
      <div>
        {data &&
          data.map((val) => (
            <>
              <div>
                <h5>{val?.country}</h5>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {val?.zipcodes &&
                    val?.zipcodes.map((val1) => (
                      <div
                        style={{ padding: "0 5px", border: "1px solid black" }}
                      >
                        {val1}
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <button onClick={() => handleEditCountry(val)}>Edit</button>
                <Form.Check
                  type="switch"
                  checked={val?.status == "active"}
                  onClick={() => handleChangeStatus(val)}
                />
              </div>
            </>
          ))}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Update Country Zipcode</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Zip Code</Form.Label>{" "}
              <Form.Control
                value={zipcodeInput}
                onChange={(e) => setZipcodeInput(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
              />
            </Form.Group>
          </Form>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {zipcodeArray &&
              zipcodeArray.map((val) => (
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <div
                    onClick={() => handleRemoveZipCode(val)}
                    style={{
                      cursor: "pointer",
                      padding: "0 5px",
                      border: "1px solid black",
                    }}
                  >
                    {val}
                  </div>
                </OverlayTrigger>
              ))}
          </div>
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

export default CountryZipcodes;

// import React from "react";

// const CountryZipcodes = () => {
//   return <div></div>;
// };

// export default CountryZipcodes;
