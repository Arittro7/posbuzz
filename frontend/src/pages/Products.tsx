/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  createdAt: string;
  updatedAt: string;
}

const Products = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => (await axios.get('/products')).data,
  });

  // Save (create or update)
  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingProduct) {
        return axios.patch(`/products/${editingProduct.id}`, values);
      }
      return axios.post('/products', values);
    },
    onSuccess: () => {
      message.success(editingProduct ? 'Product updated!' : 'Product created!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCancel();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to save product');
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => axios.delete(`/products/${id}`),
    onSuccess: () => {
      message.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => message.error('Failed to delete'),
  });

  const showModal = (product?: Product) => {
    setEditingProduct(product || null);
    form.setFieldsValue(product || { name: '', sku: '', price: 0, stock_quantity: 0 });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // This waits for validation & gets fresh values
      saveMutation.mutate(values);
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingProduct(null);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (p: number) => `$${p.toFixed(2)}` },
    { title: 'Stock', dataIndex: 'stock_quantity', key: 'stock_quantity' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete product"
            description="Are you sure?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Product
      </Button>

      {isLoading ? (
        <Spin tip="Loading..." />
      ) : error ? (
        <div style={{ color: 'red' }}>Error loading products</div>
      ) : (
        <Table columns={columns} dataSource={products} rowKey="id" />
      )}

      <Modal
        title={editingProduct ? 'Edit Product' : 'New Product'}
        open={isModalOpen}
        onOk={handleOk}
        okText={editingProduct ? 'Update' : 'Create'}
        onCancel={handleCancel}
        confirmLoading={saveMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, type: 'number', min: 0 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock_quantity" label="Stock" rules={[{ required: true, type: 'number', min: 0 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;