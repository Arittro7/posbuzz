import { Card, Row, Col, Statistic } from 'antd';
import { 
  ShoppingOutlined, 
  DollarCircleOutlined, 
  WarningOutlined 
} from '@ant-design/icons';

const Dashboard = () => {
  const cardStyle = {
    background: '#30364F',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
  };

  const titleStyle = { color: '#ffffff', fontSize: '16px' };
  const valueStyle = { color: '#ffffff', fontWeight: 'bold', fontSize: '28px' };
  const iconStyle = { fontSize: '24px', color: '#ffffff', opacity: 0.9 };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', color: '#333' }}>Dashboard</h1>
      <Row gutter={[16, 16]}>
        
        {/* Total Products */}
        <Col xs={24} sm={8}>
          <Card style={cardStyle}>
            <Statistic 
              title={<span style={titleStyle}>Total Products</span>} 
              value={42} 
              valueStyle={valueStyle}
              prefix={<ShoppingOutlined style={iconStyle} />}
            />
          </Card>
        </Col>

        {/* Total Sales */}
        <Col xs={24} sm={8}>
          <Card style={cardStyle}>
            <Statistic 
              title={<span style={titleStyle}>Total Sales</span>} 
              value={156} 
              precision={2}
              prefix={<span style={{ display: 'flex', alignItems: 'center' }}>
                <DollarCircleOutlined style={iconStyle} />
                <span style={{ color: '#fff', marginLeft: '4px', fontSize: '24px' }}>$</span>
              </span>} 
              valueStyle={valueStyle}
            />
          </Card>
        </Col>

        {/* Low Stock Items */}
        <Col xs={24} sm={8}>
          <Card style={{ 
              background: '#FA5C5C', 
              borderRadius: 12 
            }}>
            <Statistic 
              title={<span style={titleStyle}>Low Stock Items</span>} 
              value={5} 
              valueStyle={valueStyle}
              prefix={<WarningOutlined style={iconStyle} />}
            />
          </Card>
        </Col>

        <h1>⚠️This values are not Dynamic</h1>

      </Row>
    </div>
  );
};

export default Dashboard;