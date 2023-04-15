import { Link } from "react-router-dom";

const DNEPage = () => {
    return (
        <>
            <div className="dne__page">
                <h1 className="dne__title">&lt;404/&gt;</h1>
                <span className="dne__text">This page does not exist!</span>
                <span className="dne__text">Go back <Link to="/">home</Link></span>
            </div>
        </>
    )
};

export default DNEPage;