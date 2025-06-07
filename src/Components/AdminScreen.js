import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Styles/AdminScreen.css';
import Api from '../Api/api';
import AppContext from '../Context/AppContext';
import Nav from './Nav';
import SpinnerLoader from './SpinnerLoader';

const AdminScreen = () => {
    const [action, setAction] = useState('');
    const [load, setLoad] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const { jwt } = useContext(AppContext);
    const [formData, setFormData] = useState({
        Soeid: '',
        username: '',
        password: '',
        role: '',
        fname: '',
        lname: '',
        phone: '',
        address: '',
        departmentId: ''
    });
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const renderFormFields = () => {
        if (action === 'remove') {
            return (
                <>
                    <label>SOEID:</label>
                    <input type="text" name="soeid" value={formData.soeid} onChange={handleInputChange} placeholder="Enter SOEID" />
                </>
            );
        }

        return (
            <>
                <label>SOEID:</label>
                <input type="text" name="soeid" value={formData.soeid} onChange={handleInputChange} placeholder="Enter SOEID" />

                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Enter Username" />

                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter Password" />

                <label>Role:</label>
                <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="Enter Role" />

                <label>First Name:</label>
                <input type="text" name="fname" value={formData.fname} onChange={handleInputChange} placeholder="Enter First Name" />

                <label>Last Name:</label>
                <input type="text" name="lname" value={formData.lname} onChange={handleInputChange} placeholder="Enter Last Name" />

                <label>Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter Phone" />

                <label>Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter Address" />

                <label>Department ID:</label>
                <input type="text" name="departmentId" value={formData.departmentId} onChange={handleInputChange} placeholder="Enter Department ID" />
            </>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(action);

        if (action.toUpperCase() === 'ADD') {

            const requiredFields = ['soeid', 'username', 'password', 'role', 'fname', 'lname', 'phone', 'address', 'departmentId'];
            const emptyFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');

            if (emptyFields.length > 0) {
                alert(`Please fill all fields. Missing: ${emptyFields.join(', ')}`);
                return;
            }

            try {
                const res = await Api.post('/auth/Register', {
                    ...formData
                });
                console.log(res.data);
                alert('User added successfully!');
            } catch (err) {
                console.error(err);
                alert('Error adding user.');
            }

        } else if (action.toUpperCase() === 'REMOVE') {
            if (!formData.soeid || formData.soeid.trim() === '') {
                alert('Please enter SOEID to remove a user.');
                return;
            }

            try {
                const res = await Api.delete(`/emp/${formData.soeid}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
                console.log(res.data);
                alert('User removed successfully!');
            } catch (err) {
                console.error(err);
                alert('Error removing user.');
            }
        } else if (action.toUpperCase() === 'UPDATE') {
            if (formData.soeid === null || formData.soeid === '') {
                alert("Enter the id to update")
            } else {
                console.log(formData);

                const res = await Api.put(`/emp/updateAll/${formData.soeid}`, {
                    ...formData
                }, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                })
                console.log(res.data);
            }
        }

        console.log(`${action.toUpperCase()} DATA:`, formData);
        fetchEmployees()
    };

    const fetchEmployees = async () => {
        try {
            const res = await Api.get("/emp/", {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            setEmployeeList(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("Error fetching employees:", err);
        }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleDownload = async () => {
        try {
            setLoad(true)
            await delay(2000);
            const response = await Api.get('/excel/Users', {
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

    const downloadPdf = async () => {
        try {
            const response = await Api.get('/pdf/users', {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

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
    };

    const emailCreator = async () => {
        setLoad(true)
        const response = await Api.post('/email/send/all', {
            to: "aradhyapatro14@gmail.com",
            subject: 'HR Report',
            body: 'Please find attached the PDF and Excel reports.'
        }, {
            headers: {
                Authorization: `Bearer ${jwt}`
            },
        });
        setLoad(false)
        console.log(response.data);
    }

    useEffect(() => {
        fetchEmployees()

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [jwt])

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Screen</h1>

            <Nav></Nav>

            <div className="action-buttons">
                <button onClick={() => setAction('add')}>Add User</button>
                <button onClick={() => setAction('remove')}>Remove User</button>
                <button onClick={() => setAction('update')}>Update User</button>
            </div>

            {action && (
                <div className="form-section">
                    <h3>{action.charAt(0).toUpperCase() + action.slice(1)} User Form</h3>
                    <form onSubmit={handleSubmit}>
                        {renderFormFields()}
                        <button type="submit">{action.toUpperCase()}</button>
                    </form>
                </div>
            )}

            {employeeList.length > 0 && (
                <div className="employee-table-container">
                    <h3>Employee List</h3>
                    {load && <SpinnerLoader></SpinnerLoader>}
                    <div className="button-group">
                        <div className="download-dropdown" ref={dropdownRef}>
                            <button className="download-btn" onClick={() => setDropdownVisible(!dropdownVisible)}>
                                📥 Download ▼
                            </button>
                            {dropdownVisible && (
                                <div className="dropdown-menu">
                                    <button onClick={handleDownload}>Download Excel</button>
                                    <button onClick={downloadPdf}>Download PDF</button>
                                </div>
                            )}
                        </div>

                        <button className="email-btn" onClick={() => emailCreator()}>
                            Send report to Admins
                        </button>
                    </div>

                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>SOEID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Username</th>
                                <th>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeList.map((emp, index) => (
                                <tr key={index}>
                                    <td>{emp.soeid}</td>
                                    <td>{emp.fname || '-'}</td>
                                    <td>{emp.lname || '-'}</td>
                                    <td>{emp.phone || '-'}</td>
                                    <td>{emp.address || '-'}</td>
                                    <td>{emp.user.username || '-'}</td>
                                    <td>{emp.department.dname}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default AdminScreen;
