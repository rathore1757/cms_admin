import React, { useEffect, useState } from "react";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@material-ui/icons/ArrowDownward";
import axios from "axios";
import { useNavigate } from "react-router";
const BlogPages = () => {
  const [allPagesData, setAllPagesData] = useState(null);
  const navigate = useNavigate(null);
  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      width: "300px",
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
      width: "300px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      width: "300px",
    },
    {
      name: "Content",
      selector: (row) => row.content,
      sortable: true,
      width: "300px",
    },
    {
      name: "Meta Tags",
      selector: (row) => row.meta_tag,
      sortable: true,
      width: "300px",
    },
    {
      name: "Meta Description",
      selector: (row) => row.meta_description,
      sortable: true,
      width: "300px",
    },
    {
      name: "Action",
      sortable: false,
      selector: "null",
      cell: (d) => [
        <i
          key={d.id}
          data-bs-toggle="modal"
          data-bs-target="#edituser"
          className="first fas fa-pen"
        ></i>,
      ],
    },
  ];
  const tableExtensions = {
    export: false,
    print: false,
  };
  const customStyles = {
    headRow: {
      style: {
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        backgroundColor: "#E9E9E9",
        minHeight: "52px",
        borderRadius: "2px 2px 0px 0px",
        padding: "8px 25px",
        border: "none",
      },
    },
    headCells: {
      style: {
        color: "#525252",
        fontSize: "16px",
        minHeight: "52px",
      },
    },
    rows: {
      style: {
        padding: "6px 0px 6px 25px",
        fontSize: "14px",
        textTransform: "capitalize",
        minHeight: "48px !important",
      },
    },
  };
  const tableData = { columns, data: allPagesData };
  const fetchAllBlogs = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:2000/api/user/blog/fetch_all",
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response?.data?.data);
        setAllPagesData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchAllBlogs();
  }, []);
  const ExpandedComponent = ({ data }) => {
    return (
      <>
        <div>
          <div>
            <strong>{`id : `}</strong>
            {data?.id}
          </div>
          <div>
            <strong>{`Title : `}</strong>
            {data?.title}
          </div>
          <div>
            <strong>{`Slug : `}</strong>
            {data?.slug}
          </div>
          <div>
            <strong>{`Description : `}</strong>
            {data?.description}
          </div>
          <div>
            <strong>{`content : `}</strong>
            {data?.content}
          </div>
          <div>
            <strong>{`Meta Tags : `}</strong>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {data.meta_tag &&
                data.meta_tag.map((val) => (
                  <div
                    style={{
                      border: "1px solid black",
                      borderRadius: "5px",
                      padding: "5px 10px",
                    }}
                  >
                    {val}
                  </div>
                ))}
            </div>
          </div>
          <div>
            <strong>{`Meta description : `}</strong>
            {data?.meta_description}
          </div>
          <div>
            <strong>{`created at : `}</strong>
            {data?.created_at.split("T")[0]}
          </div>
        </div>
      </>
    );
  };
  return (
    <div>
      <div>
        <button onClick={() => navigate("/addpages")}>Add Pages + </button>
      </div>
      <div>
        {allPagesData && allPagesData.length > 0 && (
          <>
            <DataTableExtensions
              {...tableExtensions}
              {...tableData}
              customStyles={customStyles}
              filterPlaceholder="Search Pages Title"
            >
              <DataTable
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                columns={columns}
                data={allPagesData}
                noHeader
                defaultSortField="id"
                sortIcon={<SortIcon />}
                defaultSortAsc={true}
                pagination
                highlightOnHover
                customStyles={customStyles}
              />
            </DataTableExtensions>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPages;
