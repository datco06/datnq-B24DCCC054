import React, { useState } from 'react';
import { Button, Card, Col, List, Row, Space, Statistic, Tag, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;
const luaChonHopLe = ['Kéo', 'Búa', 'Bao'] as const;
type LuaChon = (typeof luaChonHopLe)[number];

type BanGhi = {
  id: number;
  nguoi: LuaChon;
  may: LuaChon;
  ketQua: string;
};

const taoLuaChonNgauNhien = (): LuaChon => luaChonHopLe[Math.floor(Math.random() * luaChonHopLe.length)];

const timKetQua = (nguoi: LuaChon, may: LuaChon) => {
  if (nguoi === may) {
    return 'Hòa';
  }
  if (
    (nguoi === 'Kéo' && may === 'Bao') ||
    (nguoi === 'Búa' && may === 'Kéo') ||
    (nguoi === 'Bao' && may === 'Búa')
  ) {
    return 'Bạn thắng';
  }
  return 'Bạn thua';
};

const OanTuTi: React.FC = () => {
  const [luaChonNguoi, setLuaChonNguoi] = useState<LuaChon | null>(null);
  const [luaChonMay, setLuaChonMay] = useState<LuaChon | null>(null);
  const [ketQuaHienTai, setKetQuaHienTai] = useState('');
  const [lichSu, setLichSu] = useState<BanGhi[]>([]);

  const choi = (luaChon: LuaChon) => {
    const may = taoLuaChonNgauNhien();
    const ketQuaMoi = timKetQua(luaChon, may);
    setLuaChonNguoi(luaChon);
    setLuaChonMay(may);
    setKetQuaHienTai(ketQuaMoi);
    setLichSu((truoc) => [
      { id: Date.now(), nguoi: luaChon, may, ketQua: ketQuaMoi },
      ...truoc,
    ]);
  };

  const demTheoKetQua = (ketQuaCanDem: string) => lichSu.filter((item) => item.ketQua === ketQuaCanDem).length;

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={3}>Bài 3: Trò chơi Oẳn Tù Tì</Title>
            </div>
            <Space>
              {luaChonHopLe.map((luaChon) => (
                <Button key={luaChon} type="primary" onClick={() => choi(luaChon)}>
                  {luaChon}
                </Button>
              ))}
            </Space>
            <Card>
              <Space direction="vertical">
                <Text>Người chơi: {luaChonNguoi ?? '-'}</Text>
                <Text>Máy: {luaChonMay ?? '-'}</Text>
                <Tag color={ketQuaHienTai === 'Bạn thắng' ? 'green' : ketQuaHienTai === 'Bạn thua' ? 'red' : 'blue'}>
                  {ketQuaHienTai || '-'}
                </Tag>
              </Space>
            </Card>
            <Space size="large">
              <Statistic title="Số trận thắng" value={demTheoKetQua('Bạn thắng')} />
              <Statistic title="Số trận hòa" value={demTheoKetQua('Hòa')} />
              <Statistic title="Số trận thua" value={demTheoKetQua('Bạn thua')} />
            </Space>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Lịch sử kết quả">
          <List
            dataSource={lichSu}
            locale={{ emptyText: 'Chưa có ván đấu nào.' }}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Space direction="vertical">
                  <Text strong>Người chơi: {item.nguoi}</Text>
                  <Text>Máy: {item.may}</Text>
                  <Text>Kết quả: {item.ketQua}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default OanTuTi;
