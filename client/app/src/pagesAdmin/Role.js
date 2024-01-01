import React, { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";

import PropTypes from "prop-types";
import {
  Box,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
} from "@mui/material";

import { alpha } from "@mui/system";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import "../styleCss/RoleStyle.css";

function createData(id, firstname, surname, email, status) {
  return {
    id,
    firstname,
    surname,
    email,
    status,
  };
}

const rows = [
  // createData(1, "test1", "surname1", "Email1", "user"),
  // createData(2, "test2", "surname2", "Email2", "admin"),
  // createData(3, "test3", "surname3", "Email3", "user"),
  // createData(4, "test4", "surname4", "Email4", "admin"),
  // createData(5, "test5", "surname5", "Email5", "user"),
  // createData(6, "test6", "surname6", "Email6", "admin"),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "firstname",
    numeric: false,
    disablePadding: true,
    label: "ชื่อ",
  },
  {
    id: "Surname",
    numeric: false,
    disablePadding: true,
    label: "นามสกุล",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: true,
    label: "Email",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: true,
    label: "สถานะ",
  },
];
function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          เลือกแล้ว {numSelected}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        ></Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

//component

const WindowAddUser = ({ isAddUserOpen }) => {
  return <>{isAddUserOpen && <div className="window-overlay"></div>}</>;
};
const WindowRole = ({
  isOpen,
  isAddUserOpen,
  onClose,
  handleconfirmRole,
  role,
  setRole,
  selected,
  order,
  orderBy,
  handleSelectAllClick,
  handleRequestSort,
  visibleRows,
  isSelected,
  handleClick,
  emptyRows,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <>
      {isOpen && (
        <div className="window-overlay">
          <div className="window-add-role">
            <h2>ชื่อ Role</h2>
            <input
              className="textInput-role"
              type="text"
              required={true}
              placeholder="ชื่อ Role ที่ต้องการ"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            ></input>

            <h2>รายชื่อทั้งหมด</h2>
            {/*  */}
            <Paper sx={{ width: "100%", mb: 1 }}>
              <EnhancedTableToolbar numSelected={selected.length} />
              <TableContainer>
                <Table
                  sx={{ minWidth: 500 }}
                  aria-labelledby="tableTitle"
                  size="small"
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.firstname}
                          </TableCell>
                          <TableCell align="left">{row.surname}</TableCell>
                          <TableCell align="left">{row.email}</TableCell>
                          <TableCell align="right">{row.status}</TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 33 * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>

            <button className="btn-add-name">+ เพิ่ม</button>
            <WindowAddUser isAddUserOpen={isAddUserOpen} />
            <div className="box-btn-in-window">
              <button className="close-button" onClick={onClose}>
                ยกเลิก
              </button>
              <button className="confirm-button" onClick={handleconfirmRole}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

////////
function Role() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isWindowRoleOpen, setIsWindowRoleOpen] = useState(false);
  const [isWindowAddUserOpen, setIsWindowAddUserOpen] = useState(false);
  const [role, setRole] = useState(""); //new role

  const [allRole, setAllRole] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  function openWindow() {
    setIsWindowRoleOpen(true);
  }

  function closeWindow() {
    setIsWindowRoleOpen(false);
    setRole("");
  }

  function handleconfirmRole() {
    console.log("ชื่อRole :", role);
  }

  function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  useEffect(() => {
    async function fetchRole() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/fetchRoles"
        );
        const data = response.data.results;

        // Update state with the fetched data
        if (!isEqual(data, allRole)) {
          // Update state only if the data is different
          setAllRole(data);
        }
        console.log(allRole)
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }
    fetchRole();
  }, [allRole]);
  return (
    <div>
      <div
        className="container-window"
        style={{ width: "calc(100vw - 260px)" }}
      >
        <button className="btn-add-role" onClick={openWindow}>
          <FaPlus />
          <p> เพิ่มRoleใหม่</p>
        </button>
        <h3>รายการของRole</h3>
        <WindowRole
          isOpen={isWindowRoleOpen}
          isAddUserOpen={isWindowAddUserOpen}
          onClose={closeWindow}
          handleconfirmRole={handleconfirmRole}
          role={role}
          setRole={setRole}
          selected={selected}
          order={order}
          orderBy={orderBy}
          handleSelectAllClick={handleSelectAllClick}
          handleRequestSort={handleRequestSort}
          visibleRows={visibleRows}
          isSelected={isSelected}
          handleClick={handleClick}
          emptyRows={emptyRows}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <div style={{ width: "calc(100vw - 260px)" }}>
          {allRole.map((item,index)=>{
            
            console.log("item",item)
            return(
              <div key={index} >
                  <div className="role-box">
                    <p>Role: {item.role_Name}</p>
                    <p>จำนวน {item.number_Of_people} คน</p>
                    <a>Edit</a>
                  </div>
                </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default Role;
