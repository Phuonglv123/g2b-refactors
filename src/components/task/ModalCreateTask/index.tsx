import { getBusiness } from '@/services/business';
import { listProducts } from '@/services/products';
import { createTask } from '@/services/task';
import { listUser } from '@/services/user';
import { ITask } from '@/types/task';
import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Divider, message } from 'antd';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type ModalCreateTaskProps = {
  onLoad?: any;
};

const ModalCreateTask = ({ onLoad }: ModalCreateTaskProps) => {
  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        code: values.code || dayjs().unix(),
      };
      const response = await createTask(payload);
      console.log(response);
      if (response.errorCode === 0) {
        message.success('Create task successfully');
        onLoad();
        return true;
      }
    } catch (error) {
      message.error('Create task failed');
      return false;
    }
  };
  return (
    <ModalForm<ITask>
      trigger={<Button type="primary">New Task</Button>}
      //@ts-ignore
      size="md"
      onFinish={onFinish}
      layout="horizontal"
      title="Create New Task"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      modalProps={{
        destroyOnClose: true,
        bodyProps: {
          style: {
            maxHeight: '65vh',
            overflow: 'auto',
          },
        },
      }}
      initialValues={{
        status: 'called',
        state: 'todo',
        priority: 'medium',
        type: 'task',
      }}
    >
      <Divider plain orientation="left">
        <strong>General Project</strong>
      </Divider>
      <ProFormText name="code" label="Code" />
      <ProFormSelect
        name="type"
        label="Type"
        options={[
          {
            label: 'Brief',
            value: 'brief',
          },
          {
            label: 'Task',
            value: 'task',
          },
          {
            label: 'Project',
            value: 'project',
          },
          {
            label: 'Target',
            value: 'target',
          },
        ]}
        rules={[
          {
            required: true,
            message: 'Please select the type',
          },
        ]}
      />
      <ProFormText
        name="name"
        label="Task Name"
        rules={[
          {
            required: true,
            message: 'Please enter the task name',
          },
        ]}
      />

      {/* <ProFormSelect
        name="status"
        label="Status"
        options={[
          { label: 'Called', value: 'called' },
          { label: 'Quote Sent', value: 'quote_sent' },
          { label: 'Negotiate', value: 'negotiate' },
          { label: 'Win', value: 'win' },
          { label: 'Not Contacted', value: 'not_contacted' },
          { label: 'Messaged', value: 'messaged' },
          { label: 'Consider', value: 'consider' },
          { label: 'No Response', value: 'no_response' },
        ]}
      /> */}
      {/* <ProFormSelect
        name="state"
        label="State"
        options={[
          {
            label: <Tag color="default">Todo</Tag>,
            value: 'todo',
          },
          {
            label: 'In Progress',
            value: 'in_progress',
          },
          {
            label: 'Approve',
            value: 'approve',
          },
          {
            label: 'Completed',
            value: 'completed',
          },
          {
            label: 'Follow',
            value: 'follow',
          },
          {
            label: 'Won',
            value: 'won',
          },
        ]}
      /> */}
      <ProFormDependency name={['type']}>
        {({ type }) => {
          if (type === 'brief' || type === 'target' || type === 'project') {
            return (
              <>
                <ProFormSelect
                  mode="multiple"
                  name="areas"
                  label="Areas"
                  showSearch
                  rules={[
                    {
                      required: true,
                      message: 'Please select the areas',
                    },
                  ]}
                  options={[
                    {
                      label: 'Indoor',
                      value: 'indoor',
                    },
                    {
                      label: 'Outdoor',
                      value: 'outdoor',
                    },
                    {
                      label: 'Intersection',
                      value: 'intersection',
                    },
                    {
                      label: 'Roundabout',
                      value: 'roundabout',
                    },
                    {
                      label: 'Industrial Area',
                      value: 'industrial_area',
                    },
                    {
                      label: 'Shopping Mall',
                      value: 'shopping_mall',
                    },
                    {
                      label: 'School',
                      value: 'school',
                    },
                    {
                      label: 'Airport',
                      value: 'airport',
                    },
                    {
                      label: 'Highway',
                      value: 'highway',
                    },
                    {
                      label: 'Route',
                      value: 'route',
                    },
                    {
                      label: 'City Center',
                      value: 'city_center',
                    },
                    {
                      label: 'Hospital',
                      value: 'hospital',
                    },
                    {
                      label: 'Metro/Subways',
                      value: 'metro_subways',
                    },
                    {
                      label: 'Park',
                      value: 'park',
                    },
                    {
                      label: 'Supermarket',
                      value: 'supermarket',
                    },
                    {
                      label: 'Metro/Train/Bus Station',
                      value: 'metro_train_bus_station',
                    },
                    {
                      label: 'Office Building',
                      value: 'office_building',
                    },
                    {
                      label: 'Residents',
                      value: 'residents',
                    },
                    {
                      label: 'Market Billboard',
                      value: 'market_billboard',
                    },
                    {
                      label: 'Others',
                      value: 'others',
                    },
                  ]}
                />
                <ProFormSelect
                  name="currency"
                  label="Currency"
                  options={[
                    {
                      label: 'USD',
                      value: 'USD',
                    },
                    {
                      label: 'VND',
                      value: 'VND',
                    },
                    {
                      label: 'EUR',
                      value: 'EUR',
                    },
                    {
                      label: 'GBP',
                      value: 'GBP',
                    },
                    {
                      label: 'CAD',
                      value: 'CAD',
                    },
                    {
                      label: 'CNY',
                      value: 'CNY',
                    },
                    {
                      label: 'HKD',
                      value: 'HKD',
                    },
                    {
                      label: 'IDR',
                      value: 'IDR',
                    },
                    {
                      label: 'JPY',
                      value: 'JPY',
                    },
                    {
                      label: 'SGD',
                      value: 'SGD',
                    },
                    {
                      label: 'INR',
                      value: 'INR',
                    },
                    {
                      label: 'THB',
                      value: 'THB',
                    },
                    {
                      label: 'KRW',
                      value: 'KRW',
                    },
                    {
                      label: 'MYR',
                      value: 'MYR',
                    },
                  ]}
                />
                <ProFormDigit
                  name="estimated_budget"
                  label="Estimated budget"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the estimated budget',
                    },
                  ]}
                />
                <ProFormSelect
                  name="product_id"
                  label="Product"
                  showSearch
                  rules={[
                    {
                      required: true,
                      message: 'Please select the product',
                    },
                  ]}
                  mode="multiple"
                  request={async ({ keyWords }) => {
                    return await listProducts({
                      status: 1,
                      page: 1,
                      size: 10,
                      product_code: keyWords,
                    }).then((response) => {
                      return response.data.map((product: any) => {
                        return { label: product.product_name, value: product._id };
                      });
                    });
                  }}
                />
                <ProFormSelect
                  name="business_id"
                  label="Business"
                  showSearch
                  rules={[
                    {
                      required: true,
                      message: 'Please select the business',
                    },
                  ]}
                  request={async () => {
                    return await getBusiness({}).then((response) => {
                      return response.data.map((business: any) => {
                        return { label: business.name, value: business._id };
                      });
                    });
                  }}
                />
              </>
            );
          }
        }}
      </ProFormDependency>
      <div style={{ height: 340 }}>
        <Divider plain orientation="left">
          <strong>Description</strong>
        </Divider>
        <ProForm.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Please enter the description',
            },
          ]}
        >
          <ReactQuill
            theme="snow"
            style={{ height: 200 }} // Adjusted height for approximately 5 rows
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image', 'video'],
                ['clean'],
              ],
            }}
          />
        </ProForm.Item>
      </div>

      <Divider plain orientation="left">
        <strong>More Options</strong>
      </Divider>
      <ProFormDatePicker
        name="deadline"
        label="Deadline"
        rules={[
          {
            required: true,
            message: 'Please enter the deadline',
          },
        ]}
      />
      <ProFormSelect
        name="priority"
        label="Priority"
        options={[
          {
            label: 'Low',
            value: 'low',
          },
          {
            label: 'Medium',
            value: 'medium',
          },
          {
            label: 'High',
            value: 'high',
          },
        ]}
      />
      <ProFormDateTimePicker name="estimated_time" label="Estimated Time" />
      <ProFormDateTimePicker name="actual_time" label="Actual Time" />
      <ProFormDateTimePicker name="completed_time" label="Completed Time" />
      <ProFormDatePicker name="completed_date" label="Completed Date" />
      <ProFormSelect
        name="assigned_to"
        label="Assigned To"
        showSearch
        request={async ({ keyWords }) => {
          return await listUser({ username: keyWords }).then((response) => {
            return response.data.map((user: any) => {
              return { label: user.username, value: user._id };
            });
          });
        }}
      />
      <ProFormSelect
        name="assigned_by"
        label="Assigned By"
        request={async () => {
          return await listUser({}).then((response) => {
            return response.data.map((user: any) => {
              return { label: user.username, value: user._id };
            });
          });
        }}
      />
    </ModalForm>
  );
};

export default ModalCreateTask;
