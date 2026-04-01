import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Select } from 'antd';
import { fetchMembers, updateMemberClub, Member } from '@/models/members';

const { Option } = Select;

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newClubId, setNewClubId] = useState<number | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    const data = await fetchMembers();
    setMembers(data);
    setLoading(false);
  };

  const handleChangeClub = async () => {
    if (newClubId && selectedMembers.length > 0) {
      setLoading(true);
      await updateMemberClub(selectedMembers, newClubId);
      setIsModalVisible(false);
      setSelectedMembers([]);
      setNewClubId(null);
      loadMembers();
    }
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
  ];

  const rowSelection = {
    selectedRowKeys: selectedMembers,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedMembers(selectedRowKeys as number[]);
    },
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        disabled={selectedMembers.length === 0}
        style={{ marginBottom: 16 }}
      >
        Change Club for Selected Members
      </Button>
      <Table
        dataSource={members}
        columns={columns}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
      />
      <Modal
        title="Change Club"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleChangeClub}
        okButtonProps={{ disabled: !newClubId }}
      >
        <p>Change club for {selectedMembers.length} members:</p>
        <Select
          placeholder="Select new club"
          style={{ width: '100%' }}
          onChange={(value) => setNewClubId(value)}
        >
          <Option value={1}>Club 1</Option>
          <Option value={2}>Club 2</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default MemberManagement;