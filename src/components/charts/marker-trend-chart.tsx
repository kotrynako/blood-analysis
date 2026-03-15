import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

export interface TrendDataPoint {
  date: string
  value: number
}

interface MarkerTrendChartProps {
  data: TrendDataPoint[]
  unit: string
  referenceMin: number
  referenceMax: number
  markerName: string
}

export function MarkerTrendChart({
  data,
  unit,
  referenceMin,
  referenceMax,
  markerName,
}: MarkerTrendChartProps) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-dark">
        Nėra duomenų grafiko atvaizdavimui.
      </p>
    )
  }

  const values = data.map((d) => d.value)
  const minVal = Math.min(...values, referenceMin)
  const maxVal = Math.max(...values, referenceMax)
  const padding = (maxVal - minVal) * 0.15 || 1

  const formattedData = data.map((d) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString('lt-LT', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-dark">{markerName}</h4>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 11, fill: '#737373' }}
            tickLine={false}
          />
          <YAxis
            domain={[minVal - padding, maxVal + padding]}
            tick={{ fontSize: 11, fill: '#737373' }}
            tickLine={false}
            unit={` ${unit}`}
          />
          <Tooltip
            formatter={(value) => [`${value} ${unit}`, markerName]}
            labelFormatter={(label) => `Data: ${String(label)}`}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <ReferenceLine
            y={referenceMin}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: 'Min.', position: 'left', fontSize: 10, fill: '#f59e0b' }}
          />
          <ReferenceLine
            y={referenceMax}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: 'Maks.', position: 'left', fontSize: 10, fill: '#f59e0b' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4, fill: '#6366f1' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-center text-xs text-neutral-dark">
        Normos ribos: {referenceMin}–{referenceMax} {unit}
      </p>
    </div>
  )
}
