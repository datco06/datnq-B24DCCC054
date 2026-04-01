import React, { useState } from "react";
import { Card, Button, Select, List, Typography, message } from "antd";

const { Option } = Select;

type Destination = {
  id: number;
  name: string;
  travelTime: number;
};

const destinations: Destination[] = [
  { id: 1, name: "Hội An", travelTime: 2 },
  { id: 2, name: "Vịnh Hà Long", travelTime: 1 },
  { id: 3, name: "Sa Pa", travelTime: 3 },
  { id: 4, name: "Phú Quốc", travelTime: 4 },
  { id: 5, name: "Hà Nội", travelTime: 5 },
  { id: 6, name: "Đà Nẵng", travelTime: 6 },
  { id: 7, name: "Mũi Né", travelTime: 7 },
  { id: 8, name: "Đà Lạt", travelTime: 8 },
  { id: 9, name: "Nha Trang", travelTime: 9 },
];

// 💰 Bảng chi phí di chuyển
const travelCost: { [key: string]: number } = {
  "Hội An-Hà Nội": 700000,
  "Hà Nội-Hội An": 700000,

  "Hội An-Đà Nẵng": 200000,
  "Đà Nẵng-Hội An": 200000,

  "Hà Nội-Đà Nẵng": 500000,
  "Đà Nẵng-Hà Nội": 500000,
};

// 🔧 Hàm lấy chi phí
const normalize = (str: string) =>
	str.trim().toLowerCase();
  
  const getCost = (from: string, to: string) => {
	if (from === to) return 0;
  
	const key = `${normalize(from)}-${normalize(to)}`;
  
	const normalizedMap: { [key: string]: number } = {
	  "hội an-hà nội": 700000,
	  "hà nội-hội an": 700000,
	  "hội an-đà nẵng": 200000,
	  "đà nẵng-hội an": 200000,
	  "hà nội-đà nẵng": 500000,
	  "đà nẵng-hà nội": 500000,
	};
  
	return normalizedMap[key] || 300000;
  };

const App = () => {
  const [startPoint, setStartPoint] = useState<Destination | null>(null);
  const [selected, setSelected] = useState<Destination | null>(null);

  const [itinerary, setItinerary] = useState<{
    [key: string]: Destination[];
  }>({
    "Ngày 1": [],
  });

  // ➕ Thêm ngày
  const addDay = () => {
    const newDay = `Ngày ${Object.keys(itinerary).length + 1}`;
    setItinerary({
      ...itinerary,
      [newDay]: [],
    });
  };

  // ➕ Thêm điểm
  const addDestination = (day: string) => {
    if (!startPoint) {
      message.warning("Vui lòng chọn điểm bắt đầu!");
      return;
    }

    if (!selected) return;

    setItinerary({
      ...itinerary,
      [day]: [...itinerary[day], selected],
    });
  };

  // ❌ Xoá
  const removeDestination = (day: string, index: number) => {
    const newList = [...itinerary[day]];
    newList.splice(index, 1);

    setItinerary({
      ...itinerary,
      [day]: newList,
    });
  };

  // 💰 Tổng chi phí theo chặng
  const getTotalCost = () => {
    if (!startPoint) return 0;

    let total = 0;
    let prev = startPoint.name;

    Object.values(itinerary)
      .flat()
      .forEach((item) => {
        total += getCost(prev, item.name);
        prev = item.name;
      });

    return total;
  };

  // ⏱️ Tổng thời gian
  const getTotalTime = () => {
    const tripTime = Object.values(itinerary)
      .flat()
      .reduce((sum, item) => sum + item.travelTime, 0);

    return (startPoint?.travelTime || 0) + tripTime;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tạo lịch trình du lịch</h2>

      {/* Điểm bắt đầu */}
      <div style={{ marginBottom: 10 }}>
        <Typography.Text strong>Điểm bắt đầu: </Typography.Text>
        <Select
          style={{ width: 250 }}
          placeholder="Chọn điểm bắt đầu"
          onChange={(value) =>
            setStartPoint(destinations.find((d) => d.id === value) || null)
          }
        >
          {destinations.map((d) => (
            <Option key={d.id} value={d.id}>
              {d.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Điểm đến */}
      <div>
        <Typography.Text strong>Điểm đến: </Typography.Text>
        <Select
          style={{ width: 250 }}
          placeholder="Chọn điểm đến"
          onChange={(value) =>
            setSelected(destinations.find((d) => d.id === value) || null)
          }
        >
          {destinations.map((d) => (
            <Option key={d.id} value={d.id}>
              {d.name}
            </Option>
          ))}
        </Select>

        <Button type="primary" onClick={addDay} style={{ marginLeft: 10 }}>
          + Thêm ngày
        </Button>
      </div>

      {/* Hiển thị điểm bắt đầu */}
      {startPoint && (
        <Card style={{ marginTop: 20 }} title="Điểm bắt đầu">
          {startPoint.name}
        </Card>
      )}

      {/* Danh sách ngày */}
      {Object.keys(itinerary).map((day) => {
        let prev = startPoint?.name || "";

        return (
          <Card
            key={day}
            title={day}
            style={{ marginTop: 20 }}
            extra={
              <Button onClick={() => addDestination(day)}>
                + Thêm địa điểm
              </Button>
            }
          >
            <List
              dataSource={itinerary[day]}
              locale={{ emptyText: "Chưa có điểm đến" }}
              renderItem={(item, index) => {
                const cost = getCost(prev, item.name);
                prev = item.name;

                return (
                  <List.Item
                    actions={[
                      <Button
                        danger
                        onClick={() => removeDestination(day, index)}
                      >
                        Xoá
                      </Button>,
                    ]}
                  >
                    {item.name} - 💰 {cost} VND - ⏱️ {item.travelTime}h
                  </List.Item>
                );
              }}
            />
          </Card>
        );
      })}

      {/* Tổng */}
      <Card style={{ marginTop: 20 }}>
        <Typography.Text strong>
          Tổng chi phí: {getTotalCost()} VND
        </Typography.Text>
        <br />
        <Typography.Text strong>
          Tổng thời gian: {getTotalTime()} giờ
        </Typography.Text>
      </Card>
    </div>
  );
};

export default App;