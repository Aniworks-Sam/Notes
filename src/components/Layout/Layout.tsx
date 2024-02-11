import { Fragment } from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <Fragment>
      <main>{children}</main>
    </Fragment>
  );
};

export default Layout;
