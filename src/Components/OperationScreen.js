import React, { useContext, useEffect, useState } from 'react';
import '../Styles/OperationScreen.css';
import Api from '../Api/api';
import AppContext from '../Context/AppContext';
import Nav from './Nav';

const OperationsScreen = () => {
    const [action, setAction] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const { jwt } = useContext(AppContext);
    const [formData, setFormData] = useState({
        soeid: '',
        fname: '',
        lname: '',
        phone: '',
        address: ''
    });

    const handleActionClick = (type) => {
        setAction(type);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const id = formData.soeid;

            if (action === 'update') {
                const res = await Api.put(`/emp/update/${id}`, {
                    fname: formData.fname,
                    lname: formData.lname,
                    phone: formData.phone,
                    address: formData.address,

                }, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
                );

                console.log('Employee updated:', res.data);
                alert('Employee updated successfully!');
                fetch();
            } else if (action === 'remove') {
                const res = await Api.delete(`/emp/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
                console.log('Employee removed:', res.data);
                alert('Employee removed successfully!');
                fetch();
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert('Something went wrong. Please try again.' + error.message);
        }
    };

    const fetch = async () => {
        const res = await Api.get("/emp/", {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        setEmployeeList(res.data)
        console.log(res.data)

    }

    useEffect(() => {
        fetch()
    }, [jwt])


    return (
        <div className="operations-container">
            <h1 className="operations-title">Operations Screen</h1>
            <Nav></Nav>

            <div className="action-buttons">
                <button onClick={() => handleActionClick('update')}>Update Employee</button>
                <button onClick={() => handleActionClick('remove')}>Remove Employee</button>
            </div>

            {action && (
                <div className="form-section">
                    <h3>{action.charAt(0).toUpperCase() + action.slice(1)} Employee Form</h3>
                    <form onSubmit={handleSubmit}>
                        <label>SOEID:</label>
                        <input
                            type="text"
                            name="soeid"
                            placeholder="Enter SOEID"
                            value={formData.soeid}
                            onChange={handleChange}
                            required
                        />

                        {action === 'update' && (
                            <>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="fname"
                                    placeholder="Enter First Name"
                                    value={formData.fname}
                                    onChange={handleChange}

                                />

                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lname"
                                    placeholder="Enter Last Name"
                                    value={formData.lname}
                                    onChange={handleChange}

                                />

                                <label>Phone:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}

                                />

                                <label>Address:</label>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Enter Address"
                                    value={formData.address}
                                    onChange={handleChange}

                                />
                            </>
                        )}

                        <button type="submit">{action.toUpperCase()}</button>
                    </form>
                </div>
            )}


            {employeeList.length > 0 && (
                <div className="employee-table-container">
                    <h3>Employee List</h3>
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

export default OperationsScreen;