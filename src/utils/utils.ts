/* eslint-disable no-param-reassign */
import type { UploadFile } from 'antd/es/upload/interface';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

/**
 * 获取授权经纬度信息
 */
export function getLoc() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.localStorage.setItem(
          'loc',
          JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        );
      },
      () => {
        window.localStorage.setItem('loc', JSON.stringify({ lat: 120, lng: 30 }));
      },
    );
  } else {
    window.localStorage.setItem('loc', JSON.stringify({ lat: 120, lng: 30 }));
  }
}

export function handleDataAdapter<
  T extends
    | API.ProjectListItem
    | API.ProjectPersonListItem
    | API.EngineListItem
    | API.ConstructListItem
    | API.ConstructPartListItem
    | API.ConstructLabor
    | API.ConstructPersonListItem
    | API.BranchListItem
    | API.ConstructBidListItem
    | API.IssueCategoryListItem
    | API.CarListItem
    | API.ProjectWorkOrderCategoryListItem,
>(data: T[], name = 'name', value = 'id'): T[] {
  return data.map((item: T) => {
    return { ...item, label: item[name], value: item[value] };
  });
}

export const handleFile = (fileItem: UploadFile<any>): API.FileValueType => {
  if (fileItem.response && fileItem.response.status === 200) {
    return {
      url: `api/v1/${fileItem.response.path}`,
      name: fileItem.name,
      rawUrl: fileItem.response.path,
    };
  }
  return { url: '', name: '该文件上传失败', rawUrl: '' };
};

export const isHaveAuth = (auth: number[], data: any[]) => {
  if (data.find((item) => auth.includes(+item))) {
    return true;
  }
  return false;
};

export const handleFileType = (suffix: string): number => {
  let type = 13;
  const fileTypeArr = [
    { typ: 5, suffixArr: ['png', 'jpg', 'bmp', 'jpeg', 'gif', 'PNG', 'JPG', 'BMP', 'JPEG', 'GIF'] },
    { typ: 6, suffixArr: ['flv', 'wmv', 'mp4', 'mov', 'avi', 'FLV', 'WMV', 'MP4', 'MOV', 'AVI'] },
    { typ: 7, suffixArr: ['mp3', 'wma', 'rm', 'wav', 'mid', 'MP3', 'WMA', 'RM', 'WAV', 'MID'] },
    { typ: 8, suffixArr: ['pdf', 'PDF'] },
    { typ: 9, suffixArr: ['xlsx', 'xls', 'xlt', 'xlsm', 'XLSX', 'XLS', 'XLT', 'XLSM'] },
    { typ: 10, suffixArr: ['doc', 'docx', 'docm', 'dot', 'DOC', 'DOCX', 'DOCM', 'DOT'] },
    {
      typ: 11,
      suffixArr: [
        'pot',
        'potm',
        'potx',
        'ppt',
        'pptm',
        'pptx',
        'POT',
        'POTM',
        'POTX',
        'PPT',
        'PPTM',
        'PPTX',
      ],
    },
    {
      typ: 12,
      suffixArr: ['zip', 'rar', '7z', 'tar', 'gz', 'xz', 'ZIP', 'RAR', '7Z', 'TAR', 'GZ', 'XZ'],
    },
  ];
  fileTypeArr.forEach((item) => {
    if (item.suffixArr.includes(suffix)) {
      type = item.typ;
    }
  });
  return type;
};

export const handleUrl = (param: any): string => {
  delete param.current;
  delete param.pageSize;

  return Object.keys(param)
    .map((key) => `${key}=${param[key]}`)
    .join('&');
};
