import React, { useContext } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// core components
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ThemeContext from "../../layouts/theme-setting/SettingContext";
import API from "../../API";
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const { t } = useTranslation();

  const classes = useStyles();
  const history = useHistory();
  const { tableData, tableHeaderColor, editPath, APIName,isDeletable } = props;
  const themContext = useContext(ThemeContext);

  const handleClickEdit = (id) => {
    history.push(`/${themContext.themeLayout}/${editPath}/${id}`);
  }

  const handleClickDelete = (id) => {
    API.delete(`/${APIName}`,id).then(res => {
      window.location.reload();
    })
  }

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableData.length > 0 ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {Object.keys(tableData[0]).map((key, index) => {
                return (
                  <TableCell
                    style={{ textTransform: 'capitalize' }}
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={index}
                  >
                    {t(key)}
                  </TableCell>
                );
              })}
              {(editPath || isDeletable) &&
              <TableCell
                className={classes.tableCell + " " + classes.tableHeadCell}
                style={{
                  textTransform: "uppercase",
                  textAlign: themContext.themeLayout === "admin" ? 'right' : 'left'
                }}
              >
                {t('ACTION')}
              </TableCell>
              }
            </TableRow>
          </TableHead>
        ) : (<div>{t('No data please add new one')}</div>)}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                {Object.keys(prop).map((key, index) => {
                  return (
                    <TableCell className={classes.tableCell} key={index} >
                      {
                        key === "image" ? (<div
                          dangerouslySetInnerHTML={{ __html: prop[key] }}
                        />) :
                          (prop[key])
                      }
                    </TableCell>
                  );
                })}
                {(editPath || isDeletable) &&
                <TableCell className={classes.tableCell} key={key}>
                  <div style={{
                    display: "flex",
                    justifyContent: "end"
                  }}>
                    {editPath && <EditIcon style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => handleClickEdit(prop.id)} />}
                    {isDeletable &&
                      <DeleteIcon style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => handleClickDelete(prop.id)} />
                    }
                  </div>
                </TableCell>
                }
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
