/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useState } from 'react';
import { Button, Tag, Space, Modal, message,  } from 'antd';
import request from 'umi-request';
import { PlusOutlined, EditOutlined, ClearOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import FormSubmitReset from '@/components/Form/FormSubmitReset';
import SelectInput from '@/components/Form/SelectInput';
import { handleDataAdapter } from '@/utils/utils';
import { addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

/**
 * 添加
 *
 * @param fields
 */
 const handleAdd = async (fields: API.GithubIssueItem) => {
  const hide = message.loading('正在添加');
  const res = await addRule({ ...fields });
  if (res.status === 200) {
    hide();
    message.success('添加成功');
    return true;
  }
  hide();
  message.error('添加失败请重试！');
  return false;
};

/**
 * 更新
 *
 * @param fields
 */
const handleUpdate = async (fields: API.GithubIssueItem) => {
  const hide = message.loading('正在操作');
  const res = await updateRule(fields);
  hide();
  // @ts-ignore
  if (res.status !== 200) return message.error(res.msg);
  message.success('操作成功');
  return true;
};


/**
 * 删除
 *
 * @param {(number | undefined)} id
 * @param {(React.MutableRefObject<ActionType | undefined>)} actionRef
 */
 const handleRemove = async (
  id: number | undefined,
  actionRef: React.MutableRefObject<ActionType | undefined>,
) => {
  Modal.confirm({
    title: '您确认执行本次操作吗？',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      const hide = message.loading('正在删除');
      // @ts-ignore
      const res = await removeRule(id);
      hide();
      if (res.status === 200) {
        message.success('删除成功，即将刷新');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('删除失败，请重试');
      }
    },
  });
};

const index = () => {
  const actionRef = useRef<ActionType>();  
  const [currentRow, setCurrentRow] = useState<API.GithubIssueItem>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState([])

  async function fetchInput(value?: string): Promise<boolean> {
    // const res = await searchProject({ key: value, current: 1, pageSize: 100 });
    // if (res.status === 200 && res.data) {
    //   setInputValue(handleDataAdapter(res.data));
    //   return true;
    // }
    return false;
  }

  const columns: ProColumns<API.GithubIssueItem>[] = [
    {
      title: '下拉搜索框',
      hideInTable: true,
      renderFormItem: (_, record, form) => {
        return (
          <SelectInput<API.ProjectListItem>
            data={inputValue}
            onSearch={(value) => {
              return fetchInput(value);
            }}
            name="project_id"
            labelname="project_name"
            placeholder="请选择所属项目部"
            form={form}
            onChange={(value: string) => {
              form.setFieldsValue({
                input: value,
              });
            }}
          />
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
          disabled: true,
        },
        processing: {
          text: '解决中',
          status: 'Processing',
        },
      },
    },
    {
      title: '标签',
      dataIndex: 'labels',
      search: false,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          {record.labels.map(({ name, color }) => (
            <Tag color={color} key={name}>
              {name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button key="button" icon={<EditOutlined />}
          onClick={()=>{
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </Button>,
        <Button 
          key="button" 
          icon={<ClearOutlined />}
          type="primary" 
          danger
          onClick={()=> handleRemove(record.id, actionRef)}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          return request<{
            data: API.GithubIssueItem[];
          }>('https://proapi.azurewebsites.net/github/issues', {
            params,
          });
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="高级表格"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary"
            onClick={()=>handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
      />
      <CreateForm
        onCancel={() => {
          handleModalVisible(false);
        }}
        createModalVisible={createModalVisible}
      >
        <ProTable<API.GithubIssueItem>
          onSubmit={async (value) => {
            // @ts-ignore
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          type="form"
          form={{
            layout: 'horizontal',
            labelAlign: 'right',
            labelCol: { span: 5 },
            submitter: {
              render: (props) => <FormSubmitReset {...props} />,
            },
          }}
          columns={columns}
        />
      </CreateForm>
      <UpdateForm
        onCancel={() => {
          handleUpdateModalVisible(false);
        }}
        updateModalVisible={updateModalVisible}
      >
        <ProTable
          onSubmit={async (value) => {
            // @ts-ignore
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          type="form"
          form={{
            initialValues: currentRow,
            layout: 'horizontal',
            labelAlign: 'right',
            labelCol: { span: 5 },
            submitter: {
              render: (props) => <FormSubmitReset {...props} />,
            },
          }}
          columns={columns}
        />
      </UpdateForm>
    </PageContainer>
  )
}

export default index;