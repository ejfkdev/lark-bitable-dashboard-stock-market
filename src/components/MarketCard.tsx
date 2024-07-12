import * as echarts from 'echarts';
import { useRef, useState } from 'react';
import getMarket from '@api/market/[code]';
import { Typography } from '@douyinfe/semi-ui';
import { Item } from '@shared/types';
import { css } from '@emotion/react';
import {
  useThrottleFn,
  useRafInterval,
  useMount,
  useUnmount,
  useMemoizedFn,
  useUpdateEffect,
} from 'ahooks';
import { motion } from 'framer-motion';
import { dashboard } from '@lark-base-open/js-sdk';
import { once } from 'es-toolkit';
import { useTranslation } from 'react-i18next';

export default function MarketCard({
  code = '000001',
  red = true,
  interval = 5000,
}: {
  code?: string;
  red?: boolean;
  interval?: number;
}) {
  const { t } = useTranslation();
  const chartDomRef = useRef(null);
  const [data, setData] = useState<Item | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  const resize = () =>
    requestAnimationFrame(() => {
      chartRef.current?.resize();
      once(() => setTimeout(dashboard.setRendered, 500));
    });

  const { run: update } = useThrottleFn(
    async () => {
      if (!chartRef.current) {
        return;
      }
      const data = await getMarket(code);
      if (!data) {
        return;
      }
      setData(data);
    },
    { wait: 1000 },
  );

  const draw = useMemoizedFn(() => {
    const options = getOptions(
      data?.p,
      data?.lastPrice,
      red === (data?.status === 'up'),
    );
    chartRef.current?.setOption(options);
    resize();
  });

  // 响应配置修改触发更新
  useUpdateEffect(() => {
    setData(null);
    update();
  }, [code]);
  useUpdateEffect(draw, [red]);
  useUpdateEffect(draw, [data]);

  const clear = useRafInterval(
    update,
    (parseInt(String(interval), 10) || 5) * 1000,
  );

  useMount(async () => {
    // 创建一个echarts实例，返回echarts实例。不能在单个容器中创建多个echarts实例
    const chart = echarts.init(chartDomRef.current, null, {
      renderer: 'svg',
    });
    chartRef.current = chart;
    update();
    window.addEventListener('resize', resize);
  });

  useUnmount(() => {
    clear();
    window.removeEventListener('resize', resize);
    chartRef.current?.dispose();
    chartRef.current = null;
  });

  // 鼠标移上去立即刷新一次
  const onMouseEnter = () => {
    update();
  };

  return (
    <div
      className="flex flex-col w-full min-w-10 h-full min-h-10"
      onMouseEnter={onMouseEnter}
    >
      <div className="box-border w-full grow" ref={chartDomRef}></div>
      <div className="box-border items-center content-around place-content-around gap-y-[5vh] grid grid-cols-[max-content_max-content] auto-rows-auto pb-[8vh]">
        <Typography.Text className="font-flex-[8]">
          {t(data?.name ?? '')}
        </Typography.Text>
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.5 }}
          key={Math.random()}
          className="font-flex-[6] justify-self-end font-mono"
          css={css`
            color: ${red === (data?.status === 'up') ? '#ff3300' : '#0aab62'};
          `}
        >
          {data?.increase}
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.5 }}
          key={data?.lastPrice}
          className="font-flex-[10] font-bold font-mono"
        >
          {data?.lastPrice}
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.5 }}
          key={data?.ratio}
          className="font-flex-[6] justify-self-end font-mono"
          css={css`
            color: ${red === (data?.status === 'up') ? '#ff3300' : '#0aab62'};
          `}
        >
          {data?.ratio}
        </motion.div>
      </div>
    </div>
  );
}

const getOptions = (listStr?: string, lastStr?: string, red?: boolean) => {
  const strlist = `${listStr}`.split(',');
  strlist[strlist.length - 1] = lastStr ?? '0';
  const rawlist = strlist
    .map(x => parseFloat(x) * 10000)
    .map(x => parseInt(String(x), 10));
  const datalist = [...rawlist, ...Array(50 - rawlist.length).fill(undefined)];
  const last = rawlist.at(-1)!;
  const range = Math.max(
    Math.abs(last - Math.min(...rawlist)),
    Math.max(...rawlist) - last,
    // 兜底差值，防止只有一个点时导致虚线位置绘制异常
    1,
  );
  const lineColor = red ? '#f33000' : '#0AAB62';
  const areaColor = red ? '243, 48, 0' : '10, 171, 98';
  return {
    animationDuration: 200,
    animation: true,
    animationEasing: 'cubicOut',
    grid: {
      left: '10%',
      right: '10%',
      bottom: '10%',
      top: '10%',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
      min: last - range,
      max: last + range,
    },
    series: [
      {
        data: datalist,
        type: 'line',
        lineStyle: {
          color: lineColor, // 设置线条样式
          width: 1,
        },
        label: '',
        showSymbol: false,
        markLine: {
          silent: true, // 不响应鼠标事件
          symbol: ['none', 'none'],
          lineStyle: {
            type: 'dashed', // 设置为虚线
            color: 'rgba(153, 153, 153, 0.2)', // 设置颜色为灰色
          },
          data: [
            {
              yAxis: last,
              value: '',
              label: {
                show: false, // 不显示默认的label
              },
            },
          ],
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            0.5,
            [
              { offset: 0, color: `rgba(${areaColor}, 0.25)` }, // 顶部颜色
              { offset: 1, color: `rgba(${areaColor}, 0)` }, // 底部透明
            ],
            false,
          ),
          opacity: 0.5, // 调整整个区域的透明度
        },
      },
    ],
  } as echarts.EChartsCoreOption;
};
