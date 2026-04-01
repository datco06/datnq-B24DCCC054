import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, DatePicker } from 'antd';
import { fetchClubs, addClub, updateClub, deleteClub, Club } from '@/models/clubs';
import moment from 'moment';

const ClubManagement: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    setLoading(true);
    const data = await fetchClubs();
    setClubs(data);
    setLoading(false);
  };

  const handleAddOrEdit = async () => {
    const values = await form.validateFields();
    setLoading(true);
    if (editingClub) {
      await updateClub(editingClub.id, values);
    } else {
      await addClub(values);
    }
    setIsModalVisible(false);
    setEditingClub(null);
    form.resetFields();
    loadClubs();
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this club?',
      onOk: async () => {
        setLoading(true);
        await deleteClub(id);
        loadClubs();
      },
    });
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (text: string) => <img src={text} alt="avatar" style={{ width: 50, height: 50 }} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Established Date',
      dataIndex: 'establishedDate',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Chairman',
      dataIndex: 'chairman',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (text: boolean) => (text ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      render: (record: Club) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingClub(record);
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
          setEditingClub(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Club
      </Button>
      <Table
        dataSource={clubs}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title={editingClub ? 'Edit Club' : 'Add Club'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddOrEdit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the club name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar" rules={[{ required: true, message: 'Please enter the avatar URL' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="establishedDate" label="Established Date" rules={[{ required: true, message: 'Please select the date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="chairman" label="Chairman" rules={[{ required: true, message: 'Please enter the chairman name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClubManagement;