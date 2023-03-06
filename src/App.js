import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoutes, Navigate, Outlet } from "react-router-dom";

import { setReloadTime, setUrl } from "./store/actions";

import LoginLayout from "./pages/login";
import MainLayout from "./pages/dashboard/main";
import ChildDashboard from "./pages/dashboard/child";

export default function App() {
  const dispatch = useDispatch();

  const { url, reloadTime } = useSelector(state => state.statistic);

  useEffect(() => {
    fetch("config.json")
      .then((res) => res.json())
      .then((data) => {
        dispatch(setUrl(data["SERVER_URL"]))
        dispatch(setReloadTime(data["RELOAD_TIME"]))
      })
  }, [dispatch])

  const element = useRoutes([
    { path: "/login", element: <LoginLayout url={url} /> },
    {
      path: "/",
      element: localStorage.getItem("token") ? <Outlet /> : <Navigate to="/login" />,
      children: [
        {
          path: "/",
          element: (
            <MainLayout url={url} reloadTime={reloadTime}>
              {(getData, filter, setFilter, summary, statistic, transactions, perfomance, perfomanceChart, perfomanceDetail) => (
                <ChildDashboard url={url} getData={getData} filter={filter} setFilter={setFilter} summary={summary} statistic={statistic} transactions={transactions} perfomance={perfomance} perfomanceChart={perfomanceChart} perfomanceDetail={perfomanceDetail} />
              )}
            </MainLayout>
          )
        },
      ]
    }
  ])

  return element;
};
