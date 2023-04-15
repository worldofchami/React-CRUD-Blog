import { useEffect, useState } from "react";
import '../../assets/css/profile.css';
import Create from "../admin/Create";
import Delete from "../admin/Delete";
import Update from "../admin/Update";
import { LoadingIcon, OptionBar, PostBlock } from "./Index";
import { fetchPostDetails } from "./FetchPost";
import { Backdrop } from "@mui/material";

const EditUsernameModal = ({ currentUsername, handleClose, usernameStateSetter }) => {
    const [newUsername, setNewUsername] = useState(currentUsername);

    const handleConfirm = () => {
        localStorage.setItem('profile',
            JSON.stringify(
                { ...JSON.parse(localStorage.getItem('profile')), username: newUsername }
            )
        );

        usernameStateSetter(newUsername);
        handleClose();
    };

    return (
        <Backdrop
            sx={{ color: '#ff0000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <div className="small__modal">
                <h1 className="small__modal--title">Edit Username</h1>
                <input
                    type="text"
                    value={newUsername}
                    onChange={({ target }) => setNewUsername(target.value)}
                />
                <div className="small__modal__action__container">
                    <button onClick={handleConfirm} className="submit__button button--secondary">CONFIRM</button>
                    <button onClick={handleClose} className="submit__button">CANCEL</button>
                </div>
            </div>
        </Backdrop>
    )
};

const Profile = () => {
    const [modal, setModal] = useState();
    const profile = JSON.parse(localStorage.getItem('profile'));
    const { username, postCount, recentlyViewed } = profile;
    const [newUsername, setNewUsername] = useState(username || "User");

    const [postBlocks, setPostBlocks] = useState(<LoadingIcon />);
    let postBlocksArray = [];

    useEffect(() => {
        const createPostBlocks = async () => {
            await recentlyViewed.forEach(id => {
                fetchPostDetails(id).then(post => {
                    postBlocksArray.push(<PostBlock post={post} showEdit={showEdit} showDelete={showDelete} />);
                    if (postBlocksArray.length === recentlyViewed.length) setPostBlocks(postBlocksArray)
                })
            })
        };

        createPostBlocks();

    }, []);

    const closeModal = () => {
        setModal(null);
    };

    const showCreate = () => {
        setModal(
            <Create handleClose={closeModal} />
        );
    };

    const showEdit = (id) => {
        setModal(
            <Update id={id} handleClose={closeModal} />
        );
    };

    const showDelete = (id) => {
        setModal(
            <Delete id={id} handleClose={closeModal} />
        );
    };

    const handleUsernameEdit = () => {
        setModal(
            <EditUsernameModal currentUsername={newUsername} handleClose={closeModal} usernameStateSetter={setNewUsername} />
        );
    };

    return (
        <>
            <OptionBar showCreate={showCreate} />
            {modal}
            <div className="profile__tab">
                <div className="profile__icon">
                    <img src="/blank_avatar.svg" alt="User Avatar" />
                </div>
                <div className="profile__details">
                    <span onClick={handleUsernameEdit}>Name: {newUsername} <i className="material-icons">edit</i></span>
                    <br />
                    <br />
                    <span>Posts: {!postCount ? 0 : postCount}</span>
                </div>
            </div>
            <h1 className="profile__section--title">Recently Viewed Posts</h1>
            <div className="posts__container">{postBlocks}</div>
        </>
    );
};

export default Profile;