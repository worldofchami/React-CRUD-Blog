import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { firestore } from '../../config/firebase';
import { useParams } from 'react-router-dom';
import { OptionBar, months } from './Index';
import '../../assets/css/postpage.css';
import Create from '../admin/Create';

export const fetchPostDetails = async (id) => {
    const dbInfo = [];
    const response = query(collection(firestore, 'Blogs'), where('id', '==', id));

    onSnapshot(response, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dbInfo.push(doc.data());
        });
    });

    const fetchingData = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (dbInfo[0] !== undefined) {
                resolve(dbInfo[0]);
            }
        }, 1000)
    });

    return fetchingData;
};

export const FetchPost = () => {
    const { id } = useParams();

    const [modal, setModal] = useState(null);

    const closeModal = () => {
        setModal(null);
    };

    const showCreate = () => {
        setModal(
            <Create handleClose={closeModal} />
        );
    };

    const [info, setInfo] = useState({});

    useEffect(() => {
        const getData = async () => {
            const response = query(collection(firestore, 'Blogs'), where('id', '==', id));

            onSnapshot(response, (querySnapshot) => {
                const dbInfo = [];

                querySnapshot.forEach((doc) => {
                    dbInfo.push(doc.data());
                });

                setInfo(dbInfo[0]);
            });
        };

        getData();
    }
        , []);

    const { postTitle, postText, postTime, lastUpdateTime, thumbnail } = info;

    const postDate = postTime ? new Date(postTime.seconds*1000) : null;
    const lastUpdateDate = lastUpdateTime ? new Date(lastUpdateTime.seconds*1000) : null;

    return (
        <>
            {modal}
            <OptionBar showCreate={showCreate} />
            <section className="post__page--container">
                <div className="post__thumb">
                    <img src={thumbnail} alt="" />
                </div>
                <span className="post__time">
                {postDate ?
                    lastUpdateDate ? `Posted: ${postDate.getDate()} ${months[postDate.getMonth()]} ${postDate.getFullYear()} | Updated: ${lastUpdateDate.getDate()} ${months[lastUpdateDate.getMonth()]} ${lastUpdateDate.getFullYear()}`
            : `Posted: ${postDate.getDate()} ${months[postDate.getMonth()]} ${postDate.getFullYear()}`
            : ''}
                </span>
                <h1 className="post__title">{postTitle}</h1>
                <span className="post__text">{postText}</span>
            </section>
        </>
    );
};