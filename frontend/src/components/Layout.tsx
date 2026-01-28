import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

export default function AppLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Map routes to menu keys
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/products')) return 'products';
    if (path.includes('/sales')) return 'sales';
    return 'dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: 'sales',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/sales">Sales</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          PosBuzz
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
        />
      </Sider>

     <Layout>
  <Header
    style={{
      background: '#fff',
      padding: '0 24px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
      {getSelectedKey().charAt(0).toUpperCase() + getSelectedKey().slice(1)}
    </h2>
    
  </Header>
  <Content style={{ padding: '24px', background: '#fff', minHeight: '280px', flex: 1 }}>
    <Outlet />
  </Content>
</Layout>
    </Layout>
  );
}