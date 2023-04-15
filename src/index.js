import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";
import DNEPage from './components/global/DNEPage';
import { FetchPost } from './components/global/FetchPost';
import { Index } from './components/global/Index';
import Profile from './components/global/Profile';

const App = () => {
    let routes = useRoutes([
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/post/:id",
        element: <FetchPost />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/*",
        element: <DNEPage />
      }
    ]);

    return routes;
};

ReactDOM.createRoot(document.querySelector('.page')).render(
    <Router>
      <App />
    </Router>
);