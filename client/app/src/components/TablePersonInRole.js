import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";

import axios from "axios";

import { IoAlertCircleOutline } from "react-icons/io5";

function createData(id, firstname, surname, email, status) {
  return {
    id,
    firstname,
    surname,
    email,
    status,
  };
}

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
    id: "surname",
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
    numeric: false,
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
            // color="primary"
            style={{ color: "#52B3B6" }}
            // color="#DEDEDE"
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
            align={headCell.numeric ? "right" : "left"}
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
  const { numSelected, openTabDelete } = props;
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
          เลือกแล้ว {numSelected} รายการ
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
          <IconButton onClick={() => openTabDelete()}>
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip>
          <DeleteIcon style={{ color: "#DEDEDE" }} />
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  openTabDelete: PropTypes.func.isRequired,
};

const TabDelete = ({ onClose, selected, handleDelPersonInRole }) => {
  return (
    <div className="window-overlay">
      <div className="tab-del">
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            margin: "0.5rem",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <IoAlertCircleOutline size={100} style={{ padding: 0 }} />
          <h2 style={{ padding: 0, margin: 0 }}>ลบรายการที่เลือกหรือไม่?</h2>
          <p style={{ padding: 0, margin: 0 }}>
            เมื่อลบแล้วรายการที่เลือกจะถูกนำออกทันที
          </p>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <button className="btn-cancel-del-user" onClick={() => onClose()}>
            ยกเลิก
          </button>
          <button
            className="btn-confirm-del-user"
            onClick={() => handleDelPersonInRole()}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
function TablePersonInRole({
  listPerson,
  role,
  setPerson,
  handleFetchUserInRole,
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("firstname");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isOpenTabDelete, setIsOpenTabDelete] = useState(false);
  const rows = [];
  listPerson.map((item, index) => {
    rows.push(
      createData(
        item._id,
        item.firstname,
        item.surname,
        item.email,
        item.isAdmin
      )
    );
  });
  // const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   console.log('listPerson change');

  //   // Map through listPerson to create a new array of rows
  //   const newRows = listPerson.map((item) =>
  //     createData(item._id, item.firstname, item.surname, item.email, item.isAdmin)
  //   );

  //   // Update rows with the new array
  //   setRows(newRows);
  // }, [listPerson]);

  const openTabDelete = () => {
    if (listPerson.length === selected.length) {
      alert("ไม่สามารถลบรายการทั้งหมดได้");
      setIsOpenTabDelete(false);
      return;
    }
    setIsOpenTabDelete(true);
  };

  const onCloseTabDelete = () => {
    setIsOpenTabDelete(false);
  };

  const handleDelPersonInRole = async () => {
    // console.log("list uesr_id ที่ต้องหาในการลบ", selected);
    // console.log("role_id ที่ต้องหาในการลบ", role._id);
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await axios.post(
        "http://localhost:5000/api/delUserFromRoleUpdate",
        {
          listIdToDel: selected,
          role_ID: role._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.token,
          },
        }
      );
      //ยังไม่เสร็จ เหลือ fetch user ที่มาล่าสุดใหม่
      //call api by axios POST
      await axios
        .post(
          "http://localhost:5000/api/fetchPersonFromRole",
          {
            role_ID: role._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.token,
            },
          }
        )
        .then((response) => response.data)
        .then((data) => {
          console.log("setPerson =", data.users);
          setPerson(data.users);
        });
      //set ให้หน้าต่างปิด
      onCloseTabDelete();
    } catch (error) {}
  };

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

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  // useEffect(() => {
  //   console.log("rows change");
    
  // }, [rows][listPerson]);

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            openTabDelete={openTabDelete}
          />
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
                          style={{ color: "#52B3B6" }}
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
                      <TableCell align="left" padding="none">
                        {row.surname}
                      </TableCell>
                      <TableCell align="left" padding="none">
                        {row.email}
                      </TableCell>
                      <TableCell align="left" padding="none">
                        {row.status === 0 ? "User" : "Admin"}
                      </TableCell>
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
      </Box>
      {isOpenTabDelete && (
        <TabDelete
          onClose={onCloseTabDelete}
          selected={selected}
          handleDelPersonInRole={handleDelPersonInRole}
        />
      )}
    </div>
  );
}

export default TablePersonInRole;
