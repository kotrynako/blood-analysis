import type { DemoResultItem } from '../landing-page.types'

const DEMO_RESULTS: DemoResultItem[] = [
  {
    name: 'Hemoglobinas',
    category: 'Bendras kraujo tyrimas',
    value: '14.2',
    unit: 'g/dL',
    status: 'optimal',
    trend: 80,
  },
  {
    name: 'Vitaminas D',
    category: 'Mitybos skydelis',
    value: '22',
    unit: 'ng/mL',
    status: 'low',
    trend: 30,
  },
  {
    name: 'Gliukozė (nevalgius)',
    category: 'Metabolinis skydelis',
    value: '95',
    unit: 'mg/dL',
    status: 'optimal',
    trend: 65,
  },
]

const statusConfig = {
  optimal: {
    label: 'Norma',
    className: 'bg-status-normal/10 text-status-normal',
  },
  low: {
    label: 'Žemas',
    className: 'bg-status-low/10 text-status-low',
  },
  high: {
    label: 'Aukštas',
    className: 'bg-status-high/10 text-status-high',
  },
} as const

const trendBarColor = {
  optimal: 'bg-status-normal',
  low: 'bg-status-low',
  high: 'bg-status-high',
} as const

export function StaticDemoResults() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <svg
              className="h-4 w-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-dark">
            Naujausi rezultatai
          </h2>
        </div>
        <span className="text-sm text-neutral-dark">Demo</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral bg-white">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-neutral bg-neutral-light/50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-dark">
                Rodiklis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-dark">
                Reikšmė
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-dark">
                Būsena
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-dark">
                Tendencija
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {DEMO_RESULTS.map((item) => {
              const status = statusConfig[item.status]
              const barColor = trendBarColor[item.status]
              return (
                <tr key={item.name} className="transition-colors hover:bg-neutral-light/30">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-dark">{item.name}</p>
                      <p className="text-xs text-neutral-dark">{item.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark">
                    {item.value} {item.unit}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-neutral-light">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${item.trend}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-dark">
                        {item.trend}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
