import { createEffect, createMemo, createSignal, onMount, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useRouteData } from 'solid-start'
import { createServerData$, redirect } from 'solid-start/server'
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { Line } from 'solid-chartjs'

import { Header$ } from '~/components/header$'
import { fetchUser } from '~/lib/api$'
import { getToken } from '~/lib/cookie'
import {
  Tabs$,
  TabsContent$,
  TabsList$,
  TabsTrigger$
} from '~/components/tabs$'

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await fetchUser(request)

    // should always be true, but just in case
    const sessionToken = await getToken(request)
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/analytics/report`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }
    )

    if (!response.ok) {
      throw redirect('/')
    }

    return {
      user,
      report: (await response.json()) as {
        yearly: Record<string, number>
        monthly: Record<string, number>
        daily: Record<string, number>
      }
    }
  })
}

type ChartData = {
  labels: string[]
  datasets: { label: string; data: number[] }[]
}

export default function Analytics() {
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors)
  })

  const data = useRouteData<typeof routeData>()

  const chartData = createMemo(() => {
    const report = data()?.report

    if (!report) {
      return {}
    }

    const yearlyKeys = Object.keys(report.yearly)
    const monthlyKeys = Object.keys(report.monthly).slice(0, 12)
    const dailyKeys = Object.keys(report.daily).slice(0, 30)

    const sortedYearlyKeys = yearlyKeys.sort((a, b) => {
      return parseInt(a) - parseInt(b)
    })

    const sortedMonthlyKeys = monthlyKeys.sort((a, b) => {
      return a.localeCompare(b)
    })

    const sortedDailyKeys = dailyKeys.sort((a, b) => {
      return a.localeCompare(b)
    })

    return {
      yearly: {
        labels: sortedYearlyKeys,
        datasets: [
          {
            label: 'Yearly Usage',
            data: sortedYearlyKeys.map((key) => report.yearly[key])
          }
        ]
      },
      monthly: {
        labels: sortedMonthlyKeys,
        datasets: [
          {
            label: 'Monthly Usage',
            data: sortedMonthlyKeys.map((key) => report.monthly[key])
          }
        ]
      },
      daily: {
        labels: sortedDailyKeys,
        datasets: [
          {
            label: 'Daily Usage',
            data: sortedDailyKeys.map((key) => report.daily[key])
          }
        ]
      }
    }
  })

  return (
    <>
      <main>
        <Header$ user={data()?.user} />
        <section class="container bg-background max-w-6xl rounded mt-12">
          <section class="py-4 flex flex-col gap-4">
            <h4 class="font-medium text-2xl">Análise de Uso</h4>

            <Show when={data()?.report}>
              <>
                <Tabs$>
                  <TabsList$>
                    <TabsTrigger$ value="yearly">Anual</TabsTrigger$>
                    <TabsTrigger$ value="monthly">Mensal</TabsTrigger$>
                    <TabsTrigger$ value="daily">Diário</TabsTrigger$>
                  </TabsList$>

                  <section class="flex flex-col gap-4">
                    <TabsContent$ value="yearly">
                      <Line
                        data={chartData().yearly}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false
                        }}
                        width={500}
                        height={500}
                      />
                    </TabsContent$>

                    <TabsContent$ value="monthly">
                      <Line
                        data={chartData().monthly}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true
                        }}
                        width={1000}
                        height={500}
                      />
                    </TabsContent$>

                    <TabsContent$ value="daily">
                      <Line
                        data={chartData().daily}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false
                        }}
                        width={500}
                        height={500}
                      />
                    </TabsContent$>
                  </section>
                </Tabs$>
              </>
            </Show>
          </section>
        </section>
      </main>
    </>
  )
}
