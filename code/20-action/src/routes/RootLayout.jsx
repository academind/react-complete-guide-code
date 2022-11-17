import { Outlet } from 'react-router-dom';

import MainHeader from '../components/MainHeader';

function RootLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}

export default RootLayout;
