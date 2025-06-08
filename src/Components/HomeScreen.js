import React, { useContext, useEffect, useState } from 'react';
import '../Styles/HomeScreen.css';
import Api from '../Api/api';
import AppContext from '../Context/AppContext';
import Nav from './Nav';

const HomeScreen = () => {
    const [soeid, setSoeid] = useState('');
    const [employee, setEmployee] = useState(null);
    const { jwt } = useContext(AppContext);

    useEffect(() => {
        const fetchSoeidAndDetails = async () => {
            try {
                const response = await Api.get("/emp/id", {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });

                const id = response.data;
                setSoeid(id);
                console.log(soeid);


                const empResponse = await Api.get(`/emp/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });

                setEmployee(empResponse.data);
            } catch (error) {
                console.error("Error fetching employee data:", error.message);
            }
        };

        if (jwt) {
            fetchSoeidAndDetails();
        }
    }, [jwt]);

    return (
        <div className="home-container">
            <h1 className="home-title">Home Screen</h1>

            <Nav></Nav>

            <h3 className="employee-heading">Employee Details:</h3>

            {employee ? (
                <table className="employee-table">
                    <tbody className="employee-table-body">
                        <tr className="table-row">
                            <td className="table-header">SOEID</td>
                            <td className="table-cell">{employee.soeid}</td>
                        </tr>
                        <tr className="table-row">
                            <td className="table-header">Name</td>
                            <td className="table-cell">{employee.fname} {employee.lname}</td>
                        </tr>
                        <tr className="table-row">
                            <td className="table-header">Address</td>
                            <td className="table-cell">{employee.address}</td>
                        </tr>
                        <tr className="table-row">
                            <td className="table-header">Phone</td>
                            <td className="table-cell">{employee.phone}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>Loading employee data...</p>
            )}
        </div>
    );
};

export default HomeScreen;
