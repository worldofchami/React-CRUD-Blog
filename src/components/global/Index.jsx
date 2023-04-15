/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/style.css";
import Create from "../admin/Create";
import Update from "../admin/Update";
import "../../assets/css/index.css";
import Delete from "../admin/Delete";
import Profile from "./Profile";
import { useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { firestore } from "../../config/firebase";
import { Skeleton } from "@mui/material";

export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const LoadingIcon = () => {
    return (
        <>
            <div className="loading__container">
                <i className="fa fa-circle-o-notch fa-spin"></i>
            </div>
        </>
    );
};

export const OptionBar = ({ showCreate }) => {
    return (
        <div className="options__bar">
            <Link to={"/"}>
                <div className="options__bar__icon--container">
                    <i className="material-icons">home</i>
                </div>
            </Link>
            <div className="options__bar__icon--container" onClick={showCreate}>
                <i className="material-icons">add_to_photos</i>
            </div>
            <Link to={"/profile"}>
                <div className="options__bar__icon--container">
                    <i className="material-icons">person</i>
                </div>
            </Link>
        </div>
    );
};

export const PostBlock = ({ post, showEdit, showDelete }) => {
    const { id, postTitle, postText, postTime, lastUpdateTime, thumbnail } =
        post;

    const handleClick = () => {
        if (post.id !== undefined) window.location.href = `/post/${post.id}`;

        try {
            const { recentlyViewed } = JSON.parse(
                localStorage.getItem("profile")
            );

            if (recentlyViewed.indexOf(id) < 0) {
                recentlyViewed.push(id);
                localStorage.setItem(
                    "profile",
                    JSON.stringify({
                        ...JSON.parse(localStorage.getItem("profile")),
                        recentlyViewed: recentlyViewed,
                    })
                );
            }
        } catch (e) {
            // console.log(e)
        }
    };

    let dateStr = "";

    try {
        dateStr = lastUpdateTime
            ? `Posted: ${postTime.toDate().getDate()} ${
                  months[postTime.toDate().getMonth()]
              } ${postTime.toDate().getFullYear()} | Updated: ${lastUpdateTime
                  .toDate()
                  .getDate()} ${
                  months[lastUpdateTime.toDate().getMonth()]
              } ${lastUpdateTime.toDate().getFullYear()}`
            : `Posted: ${postTime.toDate().getDate()} ${
                  months[postTime.toDate().getMonth()]
              } ${postTime.toDate().getFullYear()}`;
    } catch (e) {
        // exception
    }

    return (
        <div className="post__block">
            <Link to={`/post/${id}`} className="post__thumnail--link">
                <div
                    className="post__thumbnail--container"
                    onClick={() => handleClick(post)}
                >
                    {thumbnail ? (
                        <img src={thumbnail} alt="" />
                    ) : (
                        <Skeleton animation="wave" variant="rounded" />
                    )}
                </div>
            </Link>
            <div className="post__info--container">
                <details
                    className="post__settings"
                    onMouseLeave={({ currentTarget }) =>
                        currentTarget.removeAttribute("open")
                    }
                >
                    <summary>...</summary>
                    <div className="post__settings__options__container">
                        <ul>
                            <li onClick={() => showEdit(id)}>
                                <i className="material-icons">edit</i>
                                <span>EDIT</span>
                            </li>
                            <li onClick={() => showDelete(id)}>
                                <i className="material-icons">delete_forever</i>
                                <span>DELETE</span>
                            </li>
                        </ul>
                    </div>
                </details>
                <span className="post__title" onClick={() => handleClick(post)}>
                    {postTitle ? (
                        postTitle
                    ) : (
                        <Skeleton
                            variant="rectangular"
                            width={90}
                            height={12}
                            animation="pulse"
                        />
                    )}
                </span>
                <span className="post__short">
                    {postText ? (
                        postText
                    ) : (
                        <Skeleton
                            animation="wave"
                            variant="rectangular"
                            width={100}
                            height={10}
                        />
                    )}
                </span>
                <span className="post__time">
                    {dateStr ? (
                        dateStr
                    ) : (
                        <Skeleton
                            animation="wave"
                            variant="rectangular"
                            width={80}
                            height={9}
                        />
                    )}
                </span>
            </div>
        </div>
    );
};

const PostBlocks = ({ showEdit, showDelete }) => {
    const emptyPosts = [];
    for (let i = 0; i < 16; i++) {
        emptyPosts.push(
            <div className="post__block" key={i}>
                <div className="post__thumbnail--container"></div>
                <div className="post__info--container">
                    <details className="post__settings">
                        <summary>...</summary>
                        <div className="post__settings__options__container">
                            <ul>
                                <li>
                                    <i className="fas fa-pencil-ruler"></i>
                                    <span>EDIT</span>
                                </li>
                                <li>
                                    <i className="fas fa-trash"></i>
                                    <span>DELETE</span>
                                </li>
                            </ul>
                        </div>
                    </details>
                    <h1 className="post__title"></h1>
                    <p className="post__short"></p>
                    <span className="post__time"></span>
                </div>
            </div>
        );
    }
    //
    {
        /* <Skeleton variant="rectangular" width={210} height={118} /> */
    }
    const [postBlocks, setPostBlocks] = useState(
        <PostBlock post={{}} showEdit={"showEdit"} showDelete={"showDelete"} />
    );
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const response = query(collection(firestore, "Blogs"));

            onSnapshot(response, (querySnapshot) => {
                const dbInfo = [];
                const dataIds = [];

                querySnapshot.forEach((doc) => {
                    dbInfo.push(doc.data());
                    dataIds.push(doc.id);
                });

                setPostBlocks(
                    dbInfo.map((post, idx) => {
                        return (
                            <PostBlock
                                post={post}
                                showEdit={showEdit}
                                showDelete={showDelete}
                            />
                        );
                    })
                );

                setLoaded(true);
            });
        };

        getData();
    }, []);

    return (
        <>
            {postBlocks}
            {!loaded ? <LoadingIcon /> : <></>}
        </>
    );
};

export const Index = () => {
    const [modal, setModal] = useState(null);

    const showCreate = () => {
        setModal(<Create handleClose={closeModal} />);
    };

    const showUpdate = (id) => {
        setModal(<Update id={id} handleClose={closeModal} />);
    };

    const showDelete = (id) => {
        setModal(<Delete id={id} handleClose={closeModal} />);
    };

    // eslint-disable-next-line no-unused-vars
    const showProfile = () => {
        setModal(<Profile closeModal={closeModal} />);
    };

    const closeModal = () => {
        setModal(null);
    };

    return (
        <>
            <section className="page">
                {modal}
                <OptionBar showCreate={showCreate} />
                <div className="welcome__container">
                    <h1>Welcome to my blog!</h1>
                    <span>
                        I made this blog as a side project during my second year
                        of university, built with ReactJS and Firebase.
                        <br />
                        <br />
                        <a
                            href="https://www.linkedin.com/in/tino-chaminuka-803b8622b/"
                            target="_blank"
                        >
                            My LinkedIn
                        </a>
                        <br />
                        <br />
                        <a
                            href="https://github.com/worldofchami"
                            target="_blank"
                        >
                            My GitHub
                        </a>
                    </span>
                </div>
                <div className="posts__container">
                    <PostBlocks showEdit={showUpdate} showDelete={showDelete} />
                </div>
            </section>
        </>
    );
};
