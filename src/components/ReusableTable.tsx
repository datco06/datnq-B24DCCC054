import React from 'react';
import { Table } from 'antd';

interface ReusableTableProps {
  columns: any[];
  dataSource: any[];
  loading?: boolean;
  rowKey: string;
  rowSelection?: any;
}

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  dataSource,
  loading = false,
  rowKey,
  rowSelection,
}) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey={rowKey}
      rowSelection={rowSelection}
    />
  );
};

export default ReusableTable;