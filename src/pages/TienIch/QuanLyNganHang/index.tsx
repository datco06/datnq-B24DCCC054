import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from 'antd';

const { Title, Text } = Typography;
const mucDoOptions = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'] as const;
type MucDo = (typeof mucDoOptions)[number];

interface KhoiKienThuc {
  id: string;
  ten: string;
}

interface MonHoc {
  id: string;
  maMon: string;
  tenMon: string;
  soTinChi: number;
  khoiId: string;
}

interface CauHoi {
  id: string;
  maCauHoi: string;
  monHocId: string;
  khoiId: string;
  mucDo: MucDo;
  noiDung: string;
}

interface YeuCauDe {
  de: number;
  trungBinh: number;
  kho: number;
  ratKho: number;
}

interface DeThi {
  id: string;
  monHocId: string;
  khoiId: string;
  cauHoi: CauHoi[];
  yeuCau: YeuCauDe;
}

const khoa = {
  khoi: 'khoiKienThuc',
  mon: 'danhSachMonHoc',
  cauHoi: 'nganHangCauHoi',
  deThi: 'nganHangDeThi',
};

const doc = <T,>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
};

const ghi = <T,>(key: string, data: T[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

const taoId = () => Date.now().toString();

const QuanLyNganHang: React.FC = () => {
  const [khoi, setKhoi] = useState<KhoiKienThuc[]>(() => doc<KhoiKienThuc>(khoa.khoi));
  const [mon, setMon] = useState<MonHoc[]>(() => doc<MonHoc>(khoa.mon));
  const [cauHoi, setCauHoi] = useState<CauHoi[]>(() => doc<CauHoi>(khoa.cauHoi));
  const [deThi, setDeThi] = useState<DeThi[]>(() => doc<DeThi>(khoa.deThi));
  const [boLoc, setBoLoc] = useState<{ mon?: string; mucDo?: MucDo; khoi?: string }>({});
  const [deThiDangSua, setDeThiDangSua] = useState<DeThi | null>(null);
  const [formKhoi] = Form.useForm();
  const [formMon] = Form.useForm();
  const [formCauHoi] = Form.useForm();
  const [formDeThi] = Form.useForm();

  useEffect(() => {
    ghi(khoa.khoi, khoi);
  }, [khoi]);

  useEffect(() => {
    ghi(khoa.mon, mon);
  }, [mon]);

  useEffect(() => {
    ghi(khoa.cauHoi, cauHoi);
  }, [cauHoi]);

  useEffect(() => {
    ghi(khoa.deThi, deThi);
  }, [deThi]);

  const themKhoi = (values: { ten: string }) => {
    const ten = values.ten.trim();
    if (!ten) {
      message.warning('Tên khối không được trống');
      return;
    }
    setKhoi((prev) => [...prev, { id: taoId(), ten }]);
    formKhoi.resetFields();
  };

  const xoaKhoi = (id: string) => {
    setKhoi((prev) => prev.filter((item) => item.id !== id));
    setMon((prev) => prev.filter((item) => item.khoiId !== id));
    setCauHoi((prev) => prev.filter((item) => item.khoiId !== id));
    setDeThi((prev) => prev.filter((item) => item.khoiId !== id));
  };

  const themMon = (values: { maMon: string; tenMon: string; soTinChi: number; khoiId: string }) => {
    const ma = values.maMon.trim();
    const ten = values.tenMon.trim();
    if (!ma || !ten) {
      message.warning('Vui lòng nhập đầy đủ thông tin môn học');
      return;
    }
    setMon((prev) => [...prev, { id: taoId(), maMon: ma, tenMon: ten, soTinChi: values.soTinChi, khoiId: values.khoiId }]);
    formMon.resetFields();
  };

  const xoaMon = (id: string) => {
    setMon((prev) => prev.filter((item) => item.id !== id));
    setCauHoi((prev) => prev.filter((item) => item.monHocId !== id));
    setDeThi((prev) => prev.filter((item) => item.monHocId !== id));
  };

  const themCauHoi = (values: { maCauHoi: string; monHocId: string; khoiId: string; mucDo: MucDo; noiDung: string }) => {
    const ma = values.maCauHoi.trim();
    const noiDung = values.noiDung.trim();
    if (!ma || !noiDung) {
      message.warning('Vui lòng nhập đủ thông tin câu hỏi');
      return;
    }
    setCauHoi((prev) => [
      ...prev,
      { id: taoId(), maCauHoi: ma, monHocId: values.monHocId, khoiId: values.khoiId, mucDo: values.mucDo, noiDung },
    ]);
    formCauHoi.resetFields();
  };

  const xoaCauHoi = (id: string) => {
    setCauHoi((prev) => prev.filter((item) => item.id !== id));
  };

  const danhSachCauHoiLoc = useMemo(() => {
    return cauHoi.filter((item) => {
      if (boLoc.mon && item.monHocId !== boLoc.mon) return false;
      if (boLoc.mucDo && item.mucDo !== boLoc.mucDo) return false;
      if (boLoc.khoi && item.khoiId !== boLoc.khoi) return false;
      return true;
    });
  }, [cauHoi, boLoc]);

  const layTenMon = (id: string) => mon.find((item) => item.id === id)?.tenMon || 'Không rõ';
  const layTenKhoi = (id: string) => khoi.find((item) => item.id === id)?.ten || 'Không rõ';

  const chonNgauNhien = (danhSach: CauHoi[], soLuong: number) => {
    const clone = [...danhSach];
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone.slice(0, soLuong);
  };

  const taoDeThi = (values: { monHocId: string; khoiId: string } & YeuCauDe) => {
    const { monHocId, khoiId, de, trungBinh, kho, ratKho } = values;
    const mucDoMap: Record<MucDo, number> = {
      Dễ: de,
      'Trung bình': trungBinh,
      Khó: kho,
      'Rất khó': ratKho,
    };
    const tapHop: CauHoi[] = [];
    for (const muc of mucDoOptions) {
      const danhSach = cauHoi.filter((item) => item.monHocId === monHocId && item.khoiId === khoiId && item.mucDo === muc);
      if (danhSach.length < mucDoMap[muc]) {
        message.error(`Không đủ câu hỏi mức ${muc}`);
        return;
      }
      tapHop.push(...chonNgauNhien(danhSach, mucDoMap[muc]));
    }
    const cauHoiMoi = tapHop;
    const yeuCau: YeuCauDe = { de, trungBinh, kho, ratKho };
    setDeThi((prev) => {
      if (deThiDangSua) {
        return prev.map((item) =>
          item.id === deThiDangSua.id ? { ...item, monHocId, khoiId, cauHoi: cauHoiMoi, yeuCau } : item,
        );
      }
      return [...prev, { id: taoId(), monHocId, khoiId, cauHoi: cauHoiMoi, yeuCau }];
    });
    message.success(deThiDangSua ? 'Đã cập nhật đề thi' : 'Đã tạo đề thi');
    formDeThi.resetFields();
    setDeThiDangSua(null);
  };

  const batDauSuaDeThi = (item: DeThi) => {
    setDeThiDangSua(item);
    formDeThi.setFieldsValue({
      monHocId: item.monHocId,
      khoiId: item.khoiId,
      de: item.yeuCau.de,
      trungBinh: item.yeuCau.trungBinh,
      kho: item.yeuCau.kho,
      ratKho: item.yeuCau.ratKho,
    });
  };

  const huySuaDeThi = () => {
    setDeThiDangSua(null);
    formDeThi.resetFields();
  };

  const xoaDeThi = (id: string) => {
    setDeThi((prev) => prev.filter((item) => item.id !== id));
    if (deThiDangSua?.id === id) {
      setDeThiDangSua(null);
      formDeThi.resetFields();
    }
  };

  const tongCauHoiTheoMon = useMemo(() => {
    return mon.map((monHoc) => ({ monHocId: monHoc.id, tong: cauHoi.filter((cau) => cau.monHocId === monHoc.id).length }));
  }, [mon, cauHoi]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Bài 4: Quản lý ngân hàng câu hỏi tự luận</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="1. Danh mục khối kiến thức">
            <Form form={formKhoi} layout="inline" onFinish={themKhoi} style={{ gap: 12 }}>
              <Form.Item name="ten" rules={[{ required: true, message: 'Nhập tên khối' }]}> 
                <Input placeholder="Tên khối" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Thêm khối
                </Button>
              </Form.Item>
            </Form>
            <List
              dataSource={khoi}
              locale={{ emptyText: <Empty description="Chưa có khối kiến thức" /> }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button danger type="link" key="del" onClick={() => xoaKhoi(item.id)}>
                      Xóa
                    </Button>,
                  ]}
                >
                  {item.ten}
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="2. Danh mục môn học">
            <Form form={formMon} layout="vertical" onFinish={themMon}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item name="maMon" label="Mã môn" rules={[{ required: true, message: 'Nhập mã môn' }]}> 
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="tenMon" label="Tên môn" rules={[{ required: true, message: 'Nhập tên môn' }]}> 
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="soTinChi" label="Số tín chỉ" rules={[{ required: true, message: 'Nhập số tín chỉ' }]}> 
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="khoiId" label="Khối kiến thức" rules={[{ required: true, message: 'Chọn khối' }]}> 
                <Select placeholder="Chọn khối" options={khoi.map((item) => ({ label: item.ten, value: item.id }))} />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm môn học
              </Button>
            </Form>
            <List
              dataSource={mon}
              locale={{ emptyText: <Empty description="Chưa có môn học" /> }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button danger type="link" key="del" onClick={() => xoaMon(item.id)}>
                      Xóa
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong>{item.tenMon}</Text>
                    <Text>Mã: {item.maMon}</Text>
                    <Text>Tín chỉ: {item.soTinChi}</Text>
                    <Tag>{layTenKhoi(item.khoiId)}</Tag>
                    <Text>Tổng câu hỏi: {tongCauHoiTheoMon.find((m) => m.monHocId === item.id)?.tong || 0}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="3. Quản lý câu hỏi">
            <Form form={formCauHoi} layout="vertical" onFinish={themCauHoi}>
              <Form.Item name="maCauHoi" label="Mã câu hỏi" rules={[{ required: true, message: 'Nhập mã câu hỏi' }]}> 
                <Input />
              </Form.Item>
              <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true, message: 'Nhập nội dung' }]}> 
                <Input.TextArea rows={3} />
              </Form.Item>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Chọn môn học' }]}> 
                    <Select options={mon.map((item) => ({ label: item.tenMon, value: item.id }))} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="khoiId" label="Khối kiến thức" rules={[{ required: true, message: 'Chọn khối' }]}> 
                    <Select options={khoi.map((item) => ({ label: item.ten, value: item.id }))} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="mucDo" label="Mức độ" rules={[{ required: true, message: 'Chọn mức độ' }]}> 
                    <Select options={mucDoOptions.map((item) => ({ label: item, value: item }))} />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                Thêm câu hỏi
              </Button>
            </Form>
            <Space style={{ marginTop: 16 }}>
              <Select
                allowClear
                placeholder="Lọc theo môn"
                style={{ minWidth: 160 }}
                options={mon.map((item) => ({ label: item.tenMon, value: item.id }))}
                value={boLoc.mon}
                onChange={(value) => setBoLoc((prev) => ({ ...prev, mon: value }))}
              />
              <Select
                allowClear
                placeholder="Lọc theo khối"
                style={{ minWidth: 160 }}
                options={khoi.map((item) => ({ label: item.ten, value: item.id }))}
                value={boLoc.khoi}
                onChange={(value) => setBoLoc((prev) => ({ ...prev, khoi: value }))}
              />
              <Select
                allowClear
                placeholder="Lọc theo mức độ"
                style={{ minWidth: 160 }}
                options={mucDoOptions.map((item) => ({ label: item, value: item }))}
                value={boLoc.mucDo}
                onChange={(value) => setBoLoc((prev) => ({ ...prev, mucDo: value as MucDo | undefined }))}
              />
            </Space>
            <List
              style={{ marginTop: 16 }}
              dataSource={danhSachCauHoiLoc}
              locale={{ emptyText: <Empty description="Chưa có câu hỏi" /> }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button danger type="link" key="del" onClick={() => xoaCauHoi(item.id)}>
                      Xóa
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong>{item.maCauHoi}</Text>
                    <Text>{item.noiDung}</Text>
                    <Space>
                      <Tag color="blue">{layTenMon(item.monHocId)}</Tag>
                      <Tag>{layTenKhoi(item.khoiId)}</Tag>
                      <Tag color="purple">{item.mucDo}</Tag>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="4. Quản lý đề thi">
            <Form form={formDeThi} layout="vertical" onFinish={taoDeThi}>
              <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Chọn môn học' }]}> 
                <Select options={mon.map((item) => ({ label: item.tenMon, value: item.id }))} />
              </Form.Item>
              <Form.Item name="khoiId" label="Khối kiến thức" rules={[{ required: true, message: 'Chọn khối' }]}> 
                <Select options={khoi.map((item) => ({ label: item.ten, value: item.id }))} />
              </Form.Item>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="de" label="Số câu dễ" initialValue={0}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="trungBinh" label="Số câu trung bình" initialValue={0}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="kho" label="Số câu khó" initialValue={0}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="ratKho" label="Số câu rất khó" initialValue={0}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Space>
                <Button type="primary" htmlType="submit">
                  {deThiDangSua ? 'Lưu đề thi' : 'Tạo đề thi'}
                </Button>
                {deThiDangSua && (
                  <Button onClick={huySuaDeThi}>
                    Hủy chỉnh sửa
                  </Button>
                )}
              </Space>
            </Form>
            <List
              style={{ marginTop: 16 }}
              dataSource={deThi}
              locale={{ emptyText: <Empty description="Chưa có đề thi" /> }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" key="edit" onClick={() => batDauSuaDeThi(item)}>
                      Chỉnh sửa
                    </Button>,
                    <Button danger type="link" key="delExam" onClick={() => xoaDeThi(item.id)}>
                      Xóa
                    </Button>,
                  ]}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>Đề thi: {layTenMon(item.monHocId)}</Text>
                      <Tag>{layTenKhoi(item.khoiId)}</Tag>
                    </Space>
                    <Space>
                      <Statistic title="Dễ" value={item.yeuCau.de} />
                      <Statistic title="Trung bình" value={item.yeuCau.trungBinh} />
                      <Statistic title="Khó" value={item.yeuCau.kho} />
                      <Statistic title="Rất khó" value={item.yeuCau.ratKho} />
                    </Space>
                    <List
                      dataSource={item.cauHoi}
                      renderItem={(ch) => (
                        <List.Item>
                          <Space direction="vertical">
                            <Text strong>{ch.maCauHoi}</Text>
                            <Text>{ch.noiDung}</Text>
                            <Tag color="purple">{ch.mucDo}</Tag>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default QuanLyNganHang;
