import { IGetGanner } from '@shared/types';

export const post = async () => ({
  message: 'Hello Modern.js',
});

const marketMap = new Map<string, string>([
  ['000001', 'asia'],
  ['399001', 'asia'],
  ['HSI', 'asia'],
  ['XIN9.LOC-FTX', 'asia'],
  ['NK225', 'asia'],
  ['KOSPI', 'asia'],
  ['IXIC', 'america'],
  ['DJI', 'america'],
  ['SPX', 'america'],
  ['WICAN.LOC-FTX', 'america'],
  ['WIMEX.LOC-FTX', 'america'],
  ['WIBRA.LOC-FTX', 'america'],
  ['FTSE', 'europeafrica'],
  ['DAX', 'europeafrica'],
  ['CAC', 'europeafrica'],
  ['MIB', 'europeafrica'],
  ['AEX', 'europeafrica'],
  ['WIZAF.LOC-FTX', 'europeafrica'],
  ['DINIW', 'foreign'],
  ['EURINDEX', 'foreign'],
  ['USDCNY', 'foreign'],
  ['USDCNH', 'foreign'],
  ['EURCNY', 'foreign'],
  ['USDEUR', 'foreign'],
  ['USDGBP', 'foreign'],
  ['AW01.USD-FTX', 'other'],
  ['MN1X.USD-FTX', 'other'],
  ['AD02.USD-FTX', 'other'],
  ['AG01.USD-FTX', 'other'],
  ['FBRIC50.USD-FTX', 'other'],
  ['WI01.USD-FTX', 'other'],
]);

const get = async (code: string) => {
  const market = marketMap.get(code);
  const response = await fetch(
    `https://finance.pae.baidu.com/api/getbanner?market=${market}&finClientType=pc`,
  );
  const data = (await response.json()) as IGetGanner;
  const item = data.Result.list.find(item => item.code === code) ?? null;
  return item;
};

export default get;
