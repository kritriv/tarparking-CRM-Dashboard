import { useMemo } from 'react';
import { Col, Progress, Spin } from 'antd';

const colours = {
  draft: '#595959',
  sent: '#1890ff',
  pending: '#1890ff',
  unpaid: '#ffa940',
  overdue: '#ff4d4f',
  partially: '#13c2c2',
  paid: '#95de64',
  declined: '#ff4d4f',
  accepted: '#95de64',
  cyan: '#13c2c2',
  purple: '#722ed1',
  expired: '#614700',
};

const defaultStatistics = [
  { tag: 'draft', value: 0 },
  { tag: 'pending', value: 0 },
  { tag: 'sent', value: 0 },
  { tag: 'accepted', value: 0 },
  { tag: 'declined', value: 0 },
  { tag: 'expired', value: 0 },
];

const defaultQuoteStatistics = [
  { tag: 'pending', value: 0 },
  { tag: 'sent', value: 0 },
  { tag: 'accepted', value: 0 },
  { tag: 'cancelled', value: 0 },
  { tag: 'on hold', value: 0 },
];

const PreviewState = ({ tag, color, value }) => {
  return (
    <div style={{ color: '#595959', marginBottom: 5 }}>
      <div className="left alignLeft">{tag.charAt(0).toUpperCase() + tag.slice(1)}</div>
      <div className="right alignRight">{value} %</div>
      <Progress
        percent={value}
        showInfo={false}
        strokeColor={{
          '0%': color,
          '100%': color,
        }}
      />
    </div>
  );
};

export default function PreviewCard({
  title = 'Preview',
  statistics = defaultStatistics,
  isLoading = false,
  entity = 'quote',
}) {
  const statisticsMap = useMemo(() => {
    const stats = entity === 'quote' ? defaultQuoteStatistics : defaultStatistics;
    return stats.map(stat => {
      const matchedStat = Array.isArray(statistics) ? statistics.find(s => s.tag === stat.tag) || stat : stat;
      return { ...matchedStat, color: colours[matchedStat.tag] };
    });
  }, [statistics, entity]);


  const customSort = (a, b) => {
    const colorOrder = Object.values(colours);
    const indexA = colorOrder.indexOf(a.color);
    const indexB = colorOrder.indexOf(b.color);
    return indexA - indexB;
  };
  return (
    <Col className="gutter-row" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
      <div style={{padding: '20px'}}>
        <h3 style={{ fontSize: 'large', marginBottom: 40, marginTop: 0 }}>{title}</h3>
        {isLoading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : (
          statisticsMap
            .sort(customSort)
            .map((status, index) => (
              <PreviewState key={index} tag={status.tag} color={status.color} value={Math.floor(status.value)}/>
            ))
        )}
      </div>
    </Col>
  );
}
