import './index.css';
import { dashboard, DashboardState } from '@lark-base-open/js-sdk';
import { useEffect } from 'react';
// import classNames from 'classnames';
import { Space, Form, Button } from '@douyinfe/semi-ui';
import { useSetState } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { ICustomConfig } from '@shared/types';
import MarketCard from '@/components/MarketCard';

const Index = () => {
  const isCreate = dashboard.state === DashboardState.Create;
  const { t } = useTranslation();
  /** 是否配置模式下 */
  const isConfig = dashboard.state === DashboardState.Config || isCreate;
  const [config, setConfig] = useSetState<ICustomConfig>({
    code: '000001',
    color: 'red',
    interval: 10,
  });
  const updateConfig = (res: any) => {
    const { customConfig } = res;
    if (customConfig) {
      setConfig(customConfig);
    }
  };

  useEffect(() => {
    if (!isCreate) {
      dashboard.getConfig().then(updateConfig);
    }
    const offConfigChange = dashboard.onConfigChange(r => {
      // 监听配置变化，协同修改配置
      updateConfig(r.data);
    });

    return () => {
      offConfigChange();
    };
  }, []);

  const onClick = () => {
    // 保存配置
    dashboard.saveConfig({
      customConfig: config,
      dataConditions: [],
    } as any);
  };

  return (
    <div className="main">
      <main className="content">
        <MarketCard
          code={config?.code}
          red={config?.color === 'red'}
          interval={config?.interval}
        />
      </main>
      {isConfig && (
        <aside className="config-panel">
          <Form className="form" initValues={config} onValueChange={setConfig}>
            <Form.Select
              field="code"
              label={t('codeLabel')}
              filter
              className="w-full"
              initValue={'000001'}
            >
              {[...marketCode.keys()].map((key: string) => (
                <Form.Select.OptGroup label={t(key)} key={key}>
                  {marketCode.get(key)?.map(item => (
                    <Form.Select.Option key={item[0]} value={item[0]}>
                      {`${t(item[1])} - ${item[0]}`}
                    </Form.Select.Option>
                  ))}
                </Form.Select.OptGroup>
              ))}
            </Form.Select>
            <Form.RadioGroup
              field="color"
              type="card"
              initValue="red"
              direction="vertical"
              label={t('colorLabel')}
              className="gap-0 w-full"
            >
              <Form.Radio value="red">
                <Space>
                  <span className="font-normal">{t('raiseRed')}</span>
                  <span className="bi--graph-up-arrow text-red-600"></span>
                  <span className="bi--graph-down-arrow text-green-600"></span>
                </Space>
              </Form.Radio>
              <Form.Radio value="green">
                <Space>
                  <span className="font-normal">{t('raiseGreen')}</span>
                  <span className="bi--graph-up-arrow text-green-600"></span>
                  <span className="bi--graph-down-arrow text-red-600"></span>
                </Space>
              </Form.Radio>
              <Form.Slider
                field="interval"
                label={t('intervalLabel')}
                // @ts-expect-error
                handleDot={{ size: '4px', color: 'blue' }}
                tipFormatter={v => `${v} ${t('second')}`}
                min={1}
                max={60}
                step={1}
                marks={{
                  1: '1',
                  5: '5',
                  10: '10',
                  15: '15',
                  30: '30',
                  45: '45',
                  60: '60',
                }}
              />
            </Form.RadioGroup>
          </Form>
          <Button
            className="btn"
            theme="solid"
            type="primary"
            htmlType="submit"
            onClick={onClick}
          >
            {t('ok')}
          </Button>
        </aside>
      )}
    </div>
  );
};

export default Index;

const marketCode = new Map<string, Array<string[]>>([
  [
    'asia',
    [
      ['000001', '上证指数'],
      ['399001', '深证指数'],
      ['HSI', '恒生指数'],
      ['XIN9.LOC-FTX', '富时中国A50'],
      ['NK225', '日经指数'],
      ['KOSPI', '韩国首尔综合指数'],
    ],
  ],
  [
    'america',
    [
      ['IXIC', '纳斯达克'],
      ['DJI', '道琼斯'],
      ['SPX', '标普500'],
      ['WICAN.LOC-FTX', '富时加拿大指数'],
      ['WIMEX.LOC-FTX', '富时墨西哥指数'],
      ['WIBRA.LOC-FTX', '富时巴西指数'],
    ],
  ],
  [
    'europeafrica',
    [
      ['FTSE', '英国富时100'],
      ['DAX', '德国DAX'],
      ['CAC', '法国CAC'],
      ['MIB', '意大利MIB'],
      ['AEX', '荷兰AEX'],
      ['WIZAF.LOC-FTX', '富时南非'],
    ],
  ],
  [
    'foreign',
    [
      ['DINIW', '美元指数'],
      ['EURINDEX', '欧元指数'],
      ['USDCNY', '在岸人民币'],
      ['USDCNH', '离岸人民币'],
      ['EURCNY', '欧元兑人民币'],
      ['USDEUR', '美元兑欧元'],
      ['USDGBP', '美元兑英镑'],
    ],
  ],
  [
    '其他',
    [
      ['AW01.USD-FTX', '富时环球指数'],
      ['MN1X.USD-FTX', '富时环球100指数'],
      ['AD02.USD-FTX', '富时发达市场指数'],
      ['AG01.USD-FTX', '富时新兴市场指数'],
      ['FBRIC50.USD-FTX', '富时金砖50指数'],
      ['WI01.USD-FTX', '富时全世界'],
    ],
  ],
]);
