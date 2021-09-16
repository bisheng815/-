import React from 'react';
import { Modal } from 'antd';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  createModalVisible: boolean;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <Modal
      destroyOnClose
      width={700}
      title="添加"
      footer={null}
      visible={props.createModalVisible}
      onCancel={() => {
        props.onCancel();
      }}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
