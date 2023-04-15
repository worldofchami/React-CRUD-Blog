import { useState } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { firestore, storage } from '../../config/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import '../../assets/css/create.css';
import { Backdrop } from '@mui/material';

const Create = ({ handleClose }) => {
    const [postTitle, setPostTitle] = useState('');
    const [postText, setPostText] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleSubmit = () => {
        setUploading(true);

        const docRef = collection(firestore, 'Blogs');

        const profile = JSON.parse(
            localStorage.getItem('profile')
        );

        const { postCount } = profile;

        localStorage.setItem('profile',
            JSON.stringify(
                { ...profile, postCount: postCount + 1 }
            )
        );

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

                    const data = {
                        id: uuidv4(),
                        postTitle: postTitle.trim(),
                        postText: postText.trim(),
                        postTime: new Date(),
                        thumbnail: downloadURL
                    };

                    try {
                        addDoc(docRef, data).then(() => {
                            handleClose();
                        });
                        setPostText('');
                        setPostTitle('');
                    }

                    catch (err) {
                        console.log(err);
                    }
                });
            }
        )
    };

    return (
        <>
            <Backdrop
                sx={{ color: '#ff0000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <section className="create__modal">
                    <button onClick={handleClose} disabled={uploading} className="close__button"><i className="material-icons">close</i></button>
                    <h1 className="create__heading">New Post</h1>
                    <form action="" id="create__form">
                        <input
                            type="text"
                            className="post__title--edit"
                            onChange={({ target }) => setPostTitle(target.value)}
                            placeholder="Post Title"
                            autoFocus
                            required
                        />
                        <textarea
                            className="post__content--edit"
                            onChange={({ target }) => setPostText(target.value)}
                            placeholder="Post Content"
                            tabIndex={0}
                            required
                        ></textarea>
                        <div className="file__input__container">
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
                    <button onClick={handleSubmit} className="submit__button">CREATE</button>
                </section>
            </Backdrop>
        </>
    );
};

export default Create;