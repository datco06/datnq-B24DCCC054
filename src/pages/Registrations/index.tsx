import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag } from 'antd';
import {
  fetchRegistrations,
  addRegistration,
  updateRegistration,
  deleteRegistration,
  Registration,
} from '@/models/registrations';

const { Option } = Select;

const RegistrationManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    setLoading(true);
    const data = await fetchRegistrations();
    setRegistrations(data);
    setLoading(false);
  };

  const handleAddOrEdit = async () => {
    const values = await form.validateFields();
    setLoading(true);
    if (editingRegistration) {
      await updateRegistration(editingRegistration.id, values);
    } else {
      await addRegistration(values);
    }
    setIsModalVisible(false);
    setEditingRegistration(null);
    form.resetFields();
    loadRegistrations();
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this registration?',
      onOk: async () => {
        setLoading(true);
        await deleteRegistration(id);
        loadRegistrations();
      },
    });
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Club',
      dataIndex: 'clubId',
      render: (clubId: number) => `Club ${clubId}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => {
        const color =
          status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      render: (record: Registration) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingRegistration(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditingRegistration(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Registration
      </Button>
      <Table
        dataSource={registrations}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title={editingRegistration ? 'Edit Registration' : 'Add Registration'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddOrEdit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter the full name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter the email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter the phone number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select the gender' }]}
          >
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="clubId"
            label="Club"
            rules={[{ required: true, message: 'Please select the club' }]}
          >
            <Select>
              <Option value={1}>Club 1</Option>
              <Option value={2}>Club 2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status' }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RegistrationManagement;