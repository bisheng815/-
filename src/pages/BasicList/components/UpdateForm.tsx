import React from 'react';
import { Modal } from 'antd';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean) => void;
  updateModalVisible: boolean;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <Modal
      destroyOnClose
      width={700}
      title="修改"
      footer={null}
      visible={props.updateModalVisible}
      onCancel={() => {
        props.onCancel();
      }}
    >
      {props.children}
    </Modal>
  );
};

export default UpdateForm;
