/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Form,
  Select,
  InputNumber,
  Button,
  Table,
  Card,
  Row,
  Col,
  message,
  Spin,
  Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
}

interface SaleItem {
  productId: string;
  quantity: number;
}

const Sales = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [items, setItems] = useState<SaleItem[]>([{ productId: '', quantity: 1 }]);

  // Fetch products for dropdown
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => (await axios.get('/products')).data,
  });

  // Calculate total price in real-time
  const total = items.reduce((sum, item) => {
    if (!item.productId) return sum;
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  // Create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: async (saleItems: SaleItem[]) => {
      return axios.post('/sales', { items: saleItems });
    },
    onSuccess: () => {
      message.success('Sale created successfully!');
      queryClient.invalidateQueries({ queryKey: ['products'] }); // refresh stock
      setItems([{ productId: '', quantity: 1 }]); // reset form
      form.resetFields();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to create sale');
    },
  });

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const updateItem = (index: number, field: 'productId' | 'quantity', value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = () => {
    // Basic client-side validation
    const invalid = items.some(item => !item.productId || item.quantity < 1);
    if (invalid) {
      message.error('Please select product and valid quantity for all items');
      return;
    }

    createSaleMutation.mutate(items);
  };

  const columns = [
    {
      title: 'Product',
      render: (_: any, __: any, index: number) => (
        <Select
          placeholder="Select product"
          value={items[index].productId}
          onChange={(val) => updateItem(index, 'productId', val)}
          style={{ width: '100%' }}
          loading={productsLoading}
          disabled={productsLoading}
        >
          {products.map(p => (
            <Select.Option key={p.id} value={p.id}>
              {p.name} (Stock: {p.stock_quantity}, ${p.price})
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Quantity',
      render: (_: any, __: any, index: number) => (
        <InputNumber
          min={1}
          value={items[index].quantity}
          onChange={(val) => updateItem(index, 'quantity', val)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Subtotal',
      render: (_: any, __: any, index: number) => {
        const item = items[index];
        const product = products.find(p => p.id === item.productId);
        return product ? `$${(product.price * item.quantity).toFixed(2)}` : '-';
      },
    },
    {
      title: 'Action',
      render: (_: any, __: any, index: number) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(index)}
          disabled={items.length === 1}
        />
      ),
    },
  ];

  return (
    <Card title="Create New Sale">
      {productsLoading ? (
        <Spin tip="Loading products..." />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={items}
            rowKey={(_, index) => index!}
            pagination={false}
            bordered
          />

          <Button
            type="dashed"
            onClick={addItem}
            block
            icon={<PlusOutlined />}
            style={{ margin: '16px 0' }}
          >
            Add Another Item
          </Button>

          <Divider />

          <Row justify="space-between" align="middle">
            <Col>
              <h3>Total: ${total.toFixed(2)}</h3>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                loading={createSaleMutation.isPending}
                onClick={handleSubmit}
                disabled={createSaleMutation.isPending || total === 0}
              >
                Create Sale
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

export default Sales;