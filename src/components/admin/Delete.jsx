import { collection, deleteDoc, doc, query, onSnapshot, where } from "firebase/firestore";
import { firestore } from '../../config/firebase';
import '../../assets/css/delete.css';
import { Backdrop } from '@mui/material';

const deleteAll = (element, arr) => {
    for (const i of arr) {
        for (const j of Object.values(i)) {
            if (element === j) delete arr[arr.indexOf(i)];
        }
    }
    return arr.filter(arrElement => arrElement);
};

const Delete = ({ id, handleClose }) => {
    const handleDelete = async () => {
        const response = query(collection(firestore, 'Blogs'), where('id', '==', id));

        onSnapshot(response, (querySnapshot) => {
            querySnapshot.forEach((entry) => {
                let { recentlyViewed } = JSON.parse(localStorage.getItem('profile'));
                recentlyViewed = deleteAll(id, recentlyViewed)
                localStorage.setItem('profile',
                    JSON.stringify(
                        { ...JSON.parse(localStorage.getItem('profile')), recentlyViewed: recentlyViewed }
                    )
                );
                deleteDoc(doc(firestore, `/Blogs/${entry.id}`));
            });
        });
    };

    const handleYes = () => {
        handleDelete();
        handleClose();
    };

    const handleNo = () => {
        handleClose();
    };

    return (
        <Backdrop
            sx={{ color: '#ff0000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <section className="small__modal">
                <h1 className="delete__title">Are you sure you want to delete this post?</h1>
                <div className="small__modal__action__container">
                    <button onClick={handleYes} className="submit__button button--secondary">YES</button>
                    <button onClick={handleNo} className="submit__button">NO</button>
                </div>
            </section>
        </Backdrop>
    );
};

export default Delete;