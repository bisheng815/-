import React from 'react';
import type { FormInstance } from 'antd';
import { Select } from 'antd';
import type { SelectProps } from 'antd/es/select';

const { Option } = Select;

export type SelectValueType<T> = {
  data: T[];
  placeholder?: string;
  name?: string;
  labelname?: string;
  onSearch: (value: string) => Promise<boolean>;
  onChange: (value: string) => void;
};

const SelectInput = React.memo((props) => {
  const options = props.data.map((d: API.ProjectListItem) => (
    <Option value={d.value || ''} key={d.value}>
      {d.label}
    </Option>
  ));
  return (
    <Select
      showSearch
      value={props.form?.getFieldValue(props.labelname || '')}
      placeholder={props.placeholder}
      defaultActiveFirstOption={false}
      filterOption={false}
      notFoundContent={null}
      {...props}
    >
      {options}
    </Select>
  );
}) as <T>(
  props: SelectValueType<T> & { form?: FormInstance<any> | undefined } & SelectProps<string>,
) => React.ReactElement;

export default SelectInput;
