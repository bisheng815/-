import React from 'react';
import type { SubmitterProps } from '@ant-design/pro-form/lib/components/Submitter';
import type { FormInstance } from 'antd';
import { Button } from 'antd';

export default (
  props: SubmitterProps<Record<string, unknown>> & {
    form?: FormInstance<any> | undefined;
  } & {
    submit: () => void;
    reset: () => void;
  },
) => (
  <div style={{display: 'flex', justifyContent: 'center'}}>
    <Button
      style={{
        marginRight: 20,
      }}
      onClick={() => {
        props.form?.resetFields();
        // props.onReset();
        props.reset();
      }}
    >
      重置
    </Button>
    <Button type="primary" onClick={() => props.form?.submit?.()}>
      提交
    </Button>
  </div>
);
