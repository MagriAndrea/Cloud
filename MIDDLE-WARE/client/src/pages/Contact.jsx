import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Contact = () => {
    const [apiResponse, setApiResponse] = useState([])

    const fetchData = () => {
        axios.get("http://localhost:4000/users/get", {
            headers : {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhb2xvQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTg2MjYzOCwiZXhwIjoxNzAxODY2MjM4fQ.qJl9xnEa3MPTRubVxaVz-SJrEeSFpWeKVKvgtulE9sM"}
        }).then((res) => {
            setApiResponse(res.data)
            console.log(res.data)
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <h1>CONTATTI E INFORMAZIONI</h1>
            {apiResponse && apiResponse.map((user)=> (
                <ol>
                    <li>user.email: {user.email}</li>
                    <li>user.role: {user.role}</li>
                    <li>user._id: {user._id}</li>
                    <li>user.usage.latestRequestDate: {user.usage.latestRequestDate}</li>
                    <li>user.usage.numberOfRequests: {user.usage.numberOfRequests}</li>
                </ol>
            ))}
        </div>
    );
};

export default Contact;