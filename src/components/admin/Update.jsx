/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { collection, setDoc, doc, query, onSnapshot, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firestore, storage } from '../../config/firebase';
import { Backdrop } from '@mui/material';

const Update = ({ id, handleClose }) => {
    const [postTitle, setPostTitle] = useState('');
    const [postText, setPostText] = useState('');
    const [postTime, setPostTime] = useState(null);
    const [postId, setPostId] = useState('');
    const [targetDoc, setTargetDoc] = useState(null);
    const [thumbnail, setThumbnail] = useState('');
    const [changingThumbnail, setChangingThumbnail] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const response = query(collection(firestore, 'Blogs'), where('id', '==', id));

            setTargetDoc(response);

            onSnapshot(response, (querySnapshot) => {
                const dbInfo = [];

                querySnapshot.forEach((doc) => {
                    dbInfo.push(doc.data());
                });

                setPostTitle(dbInfo[0].postTitle);
                setPostText(dbInfo[0].postText);
                setPostId(dbInfo[0].id);
                setPostTime(dbInfo[0].postTime);
                setThumbnail(dbInfo[0].thumbnail);
            });
        };

        getData();
    }
        , []);


    const handleSubmit = async () => {
        setUploading(true);
        console.log(changingThumbnail)
        if(changingThumbnail) {
            const storageRef = ref(storage, `files/${thumbnail.name}`);
        const uploadTask = uploadBytesResumable(storageRef, thumbnail);
        uploadTask.on('state_changed',
            (snapshot) => {
                // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                // error handling
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUploading(false);

                    const newPostDetails = {
                        id: postId,
                        postTitle: postTitle.trim(),
                        postText: postText.trim(),
                        postTime: postTime,
                        lastUpdateTime: new Date(),
                        thumbnail: downloadURL
                    };

                    onSnapshot(targetDoc, (querySnapshot) => {
                        querySnapshot.forEach((entry) => {
                            setDoc(doc(firestore, `/Blogs/${entry.id}`), newPostDetails, { merge: true }).then(() => handleClose());
                        })
                    });
                });
            }
        )
        }

        else {
            const newPostDetails = {
                id: postId,
                postTitle: postTitle.trim(),
                postText: postText.trim(),
                postTime: postTime,
                lastUpdateTime: new Date(),
                thumbnail: thumbnail
            };

            onSnapshot(targetDoc, (querySnapshot) => {
                querySnapshot.forEach((entry) => {
                    setDoc(doc(firestore, `/Blogs/${entry.id}`), newPostDetails, { merge: true }).then(() => handleClose());
                })
            });
        }
    };

    return (
        <Backdrop
            sx={{ color: '#ff0000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <section className="create__modal">
                <button onClick={handleClose} disabled={uploading} className="close__button"><i className="material-icons">close</i></button>
                <h1 className="create__heading">Edit Post</h1>
                <form action="" id="create__form">
                    <input
                        type="text"
                        className="post__title--edit"
                        onChange={({ target }) => setPostTitle(target.value)}
                        value={postTitle}
                    />
                    <textarea
                        className="post__content--edit"
                        onChange={({ target }) => setPostText(target.value)}
                        value={postText}
                    ></textarea>
                    <div className="file__input__container" onClick={() => setChangingThumbnail(true)}>
                        <input
                            type="file"
                            id="thumbnail_input"
                            accept="image/*"
                            onChange={({ target }) => setThumbnail(target.files[0])}
                        />
                        <label htmlFor="thumbnail_input"><i className="material-icons">attachment</i>CHOOSE THUMBNAIL</label>
                    </div>
                </form>
                <span className="upload__state">{uploading ? 'UPLOADING...' : ''}</span>
                <button onClick={handleSubmit} className="submit__button">UPDATE</button>
            </section>
        </Backdrop>
    );
};

export default Update;