import React, { useEffect, useState } from 'react';
import axios from "axios"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import '@splidejs/react-splide/css'

const Home = () => {
    const [apiResponse, setApiResponse] = useState([]);

    const fetchPost = () => {
        const response = axios.get("https://jsonplaceholder.typicode.com/posts")
            .then((res) =>
                setApiResponse(res)
            ).catch((e) => {
                console.log(e)
            })
    }

    useEffect(() => {
        fetchPost()
    }, [])

    return (
        <>
            <h1>Home page</h1>
            <Splide aria-label="My Favorite Images">
                {apiResponse.data && apiResponse.data.map(post => (

                    <SplideSlide key={post.id}>{post.title}</SplideSlide>

                ))}
            </Splide>
            <div>
                {apiResponse.data && apiResponse.data.map(post => (
                    <>
                        <p key={post.id}>userId: {post.userId}</p>
                        <p key={post.id}>id: {post.id}</p>
                        <p key={post.id}>title: {post.title}</p>
                        <p key={post.id}>body: {post.body}</p>
                    </>
                ))}
            </div>
        </>
    );
};

export default Home;