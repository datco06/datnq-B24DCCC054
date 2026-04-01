import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import ColumnChart from '@/components/Chart/ColumnChart';
import { fetchClubs } from '@/models/clubs';
import { fetchRegistrations } from '@/models/registrations';

const Reports: React.FC = () => {
  const [clubCount, setClubCount] = useState(0);
  const [registrationStats, setRegistrationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const clubs = await fetchClubs();
    const registrations = await fetchRegistrations();

    setClubCount(clubs.length);

    const stats = registrations.reduce(
      (acc, reg) => {
        acc[reg.status.toLowerCase()] += 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 },
    );
    setRegistrationStats(stats);

    const data = clubs.map((club) => {
      const clubRegistrations = registrations.filter((reg) => reg.clubId === club.id);
      return {
        name: club.name,
        pending: clubRegistrations.filter((reg) => reg.status === 'Pending').length,
        approved: clubRegistrations.filter((reg) => reg.status === 'Approved').length,
        rejected: clubRegistrations.filter((reg) => reg.status === 'Rejected').length,
      };
    });
    setChartData(data);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Clubs" value={clubCount} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Pending Registrations" value={registrationStats.pending} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Approved Registrations" value={registrationStats.approved} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Rejected Registrations" value={registrationStats.rejected} />
          </Card>
        </Col>
      </Row>
      <Card title="Registration Statistics by Club">
        <ColumnChart
          data={chartData}
          xField="name"
          yField={['pending', 'approved', 'rejected']}
          seriesField="status"
        />
      </Card>
    </div>
  );
};

export default Reports;