import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Divider, InputNumber, List, Row, Space, Statistic, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const MAX_ATTEMPTS = 10;
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

interface GuessRecord {
  attempt: number;
  value: number;
  feedback: string;
}

const getRandomNumber = () => Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;

const DoanSo: React.FC = () => {
  const [secret, setSecret] = useState<number>(() => getRandomNumber());
  const [attempt, setAttempt] = useState(0);
  const [currentGuess, setCurrentGuess] = useState<number | null>(null);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState<string>('Bạn có 10 lượt đoán. Chúc bạn may mắn!');
  const [history, setHistory] = useState<GuessRecord[]>([]);

  const remainingAttempts = useMemo(() => MAX_ATTEMPTS - attempt, [attempt]);

  const handleGuess = () => {
    if (status !== 'playing' || currentGuess === null) {
      return;
    }

    if (currentGuess < MIN_NUMBER || currentGuess > MAX_NUMBER) {
      setMessage(`Vui lòng nhập số trong khoảng ${MIN_NUMBER} - ${MAX_NUMBER}.`);
      return;
    }

    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    if (currentGuess === secret) {
      const successMsg = 'Chúc mừng! Bạn đã đoán đúng!';
      setMessage(successMsg);
      setStatus('won');
      setHistory((prev) => [...prev, { attempt: nextAttempt, value: currentGuess, feedback: successMsg }]);
      return;
    }

    if (nextAttempt >= MAX_ATTEMPTS) {
      const failMsg = `Bạn đã hết lượt! Số đúng là ${secret}.`;
      setMessage(failMsg);
      setStatus('lost');
      setHistory((prev) => [...prev, { attempt: nextAttempt, value: currentGuess, feedback: failMsg }]);
      return;
    }

    const feedback = currentGuess < secret ? 'Bạn đoán quá thấp!' : 'Bạn đoán quá cao!';
    setMessage(feedback);
    setHistory((prev) => [...prev, { attempt: nextAttempt, value: currentGuess, feedback }]);
  };

  const resetGame = () => {
    setSecret(getRandomNumber());
    setAttempt(0);
    setCurrentGuess(null);
    setStatus('playing');
    setMessage('Bạn có 10 lượt đoán. Chúc bạn may mắn!');
    setHistory([]);
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={3}>Bài 1: Trò chơi đoán số</Title>
              <Paragraph>
                Hệ thống sẽ sinh ngẫu nhiên một số từ {MIN_NUMBER} đến {MAX_NUMBER}. Bạn có tổng cộng {MAX_ATTEMPTS}{' '}
                lượt đoán để tìm ra con số bí mật.
              </Paragraph>
            </div>
            <Statistic title="Số lượt còn lại" value={remainingAttempts} suffix={`/ ${MAX_ATTEMPTS}`} />
            <InputNumber
              min={MIN_NUMBER}
              max={MAX_NUMBER}
              value={currentGuess ?? undefined}
              onChange={(value) => setCurrentGuess(typeof value === 'number' ? value : null)}
              placeholder="Nhập số bạn đoán"
              disabled={status !== 'playing'}
              style={{ width: '100%' }}
            />
            <Space>
              <Button type="primary" onClick={handleGuess} disabled={status !== 'playing'}>
                Gửi dự đoán
              </Button>
              <Button onClick={resetGame}>Chơi lại</Button>
            </Space>
            <Alert type={status === 'won' ? 'success' : status === 'lost' ? 'error' : 'info'} message={message} showIcon />
          </Space>
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Lịch sử dự đoán">
          {history.length > 0 && (
            <List
              dataSource={history}
              renderItem={(item) => (
                <List.Item key={item.attempt}>
                  <Space direction="vertical">
                    <Text strong>Lần {item.attempt}</Text>
                    <Text>Dự đoán: {item.value}</Text>
                    <Text type={item.feedback.includes('Chúc mừng') ? 'success' : item.feedback.includes('hết lượt') ? 'danger' : undefined}>
                      {item.feedback}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          )}
          <Divider />
        </Card>
      </Col>
    </Row>
  );
};

export default DoanSo;
