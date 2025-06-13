import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Styles/AdminScreen.css';
import Api from '../Api/api';
import AppContext from '../Context/AppContext';
import Nav from './Nav';
import SpinnerLoader from './SpinnerLoader';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const DepartmentScreen = () => {
    const { jwt } = useContext(AppContext);
    const [load, setLoad] = useState(false);
    const [action, setAction] = useState('');
    const [departmentList, setDepartmentList] = useState([]);
    const [formData, setFormData] = useState({
        dname: '',
        soeid: ''
    });
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const columns = [
        { field: 'departmentId', headerName: 'Department ID', width: 70 },
        { field: 'dname', headerName: 'Name', width: 130 },
        { field: 'soeid', headerName: 'Head SOEID', width: 130 }
    ];
    const [rows, setRows] = useState([])
    const paginationModel = { page: 0, pageSize: 5 };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchDepartments = async () => {
        try {
            const res = await Api.get('dep/', {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            setDepartmentList(res.data);
            console.log(res.data)
            setRows(res.data)
        } catch (err) {
            console.error("Failed to fetch departments:", err);
        }
    };

    useEffect(() => {
        fetchDepartments();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [jwt]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (action.toUpperCase() === 'ADD') {
            if (!formData.dname || !formData.soeid) {
                alert("Please enter both department name and SOEID of department head.");
                return;
            }
            try {
                await Api.post('dep/create', formData, {
                    headers: { Authorization: `Bearer ${jwt}` }
                });
                alert("Department added successfully!");
                fetchDepartments();
            } catch (err) {
                console.error(err);
                alert("Error adding department.");
            }
        }
    };

    const renderFormFields = () => {
        return (
            <>
                <label>Department Name:</label>
                <input type="text" name="dname" value={formData.dname} onChange={handleInputChange} placeholder="Enter Department Name" />

                {action !== 'remove' && (
                    <>
                        <label>Department Head SOEID:</label>
                        <input type="text" name="soeid" value={formData.soeid} onChange={handleInputChange} placeholder="Enter SOEID of Department Head" />
                    </>
                )}
            </>
        );
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleDownloadpdf = async () => {
        try {
            setLoad(true)
            const response = await Api.get('/pdf/departments', {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            await delay(2000)
            setLoad(false)

            // Create a link to download the PDF
            const disposition = response.headers['content-disposition'];
            let filename = 'default_filename.xlsx';

            if (disposition && disposition.includes('filename=')) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) {
                    filename = match[1];
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${filename}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("PDF download failed:", error);
        }
    }

    const handleDownload = async () => {
        try {
            setLoad(true)
            await delay(2000);
            const response = await Api.get('/excel/Departments', {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            setLoad(false)

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const disposition = response.headers['content-disposition'];
            let filename = 'default_filename.xlsx';

            if (disposition && disposition.includes('filename=')) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) {
                    filename = match[1];
                }
            }

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            link.download = filename;
            link.click();
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download user Excel file.");
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Department Management</h1>
            <Nav />

            <div className="action-buttons">
                <button onClick={() => setAction('add')}>Add Department</button>
            </div>

            {action && (
                <div className="form-section">
                    <h3>{action.charAt(0).toUpperCase() + action.slice(1)} Department</h3>
                    <form onSubmit={handleSubmit}>
                        {renderFormFields()}
                        <button type="submit">{action.toUpperCase()}</button>
                    </form>
                </div>
            )}



            {departmentList.length > 0 && (
                <div className="employee-table-container">
                    <h3>Department List</h3>
                    <div className="download-dropdown" ref={dropdownRef}>
                        <button className="download-btn" onClick={() => setDropdownVisible(!dropdownVisible)}>
                            📥 Download ▼
                        </button>
                        {dropdownVisible && (
                            <div className="dropdown-menu">
                                <button onClick={handleDownload}>Download Excel</button>
                                <button onClick={handleDownloadpdf}>Download PDF</button>
                            </div>
                        )}
                    </div>

                    {load && <SpinnerLoader></SpinnerLoader>}

                    <Paper sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowId={(row) => row.departmentId}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[3, 5, 10]}

                            sx={{ border: 0 }}
                        />
                    </Paper>


                </div>
            )}
        </div>
    );
};

export default DepartmentScreen;
