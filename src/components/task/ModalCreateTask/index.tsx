import { getBusiness } from '@/services/business';
import { listProducts } from '@/services/products';
import { createSubTask, createTask, updateTask } from '@/services/task';
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
  initValue?: any;
  type?: 'create' | 'update';
  subTask?: any;
};

const ModalCreateTask = ({ onLoad, initValue, type, subTask }: ModalCreateTaskProps) => {
  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        code: values.code || dayjs().unix(),
      };
      if (subTask) {
        const response = await createSubTask(subTask, payload);
        console.log(response);
        if (response.errorCode === 0) {
          message.success('Create sub task successfully');
          onLoad();
          return true;
        }
      } else {
        const response = await createTask(payload);
        console.log(response);
        if (response.errorCode === 0) {
          message.success('Create task successfully');
          onLoad();
          return true;
        }
      }
    } catch (error) {
      message.error('Create task failed');
      return false;
    }
  };
  const onUpdate = async (values: any) => {
    try {
      const payload: any = {
        ...values,
        assigned_to: values.assigned_to || null,
        assigned_by: values.assigned_by || null,
      };

      const response = await updateTask(initValue?._id, payload);
      console.log(response);
      if (response.errorCode === 0) {
        message.success('Update task successfully');
        onLoad();
        return true;
      }
    } catch (error) {
    } finally {
      onLoad();
      return true;
    }
  };

  console.log(subTask);
  return (
    <ModalForm<ITask>
      trigger={
        type !== 'update' ? (
          <Button type="primary">{subTask ? 'Create sub task' : 'Create Task'}</Button>
        ) : (
          <div>Update Task</div>
        )
      }
      //@ts-ignore
      size="md"
      onFinish={type !== 'update' ? onFinish : onUpdate}
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
        ...initValue,
        status: 'called',
        state: 'todo',
        priority: initValue?.priority || 'medium',
        type: initValue?.type || 'task',
        assigned_to: initValue?.assigned_to?.map((user: any) => user._id) || [],
        assigned_by: initValue?.assigned_by?._id || '',
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
                <ProFormDigit name="estimated_budget" label="Estimated budget" />
                <ProFormSelect
                  name="product_id"
                  label="Product"
                  showSearch
                  mode="multiple"
                  request={async () => {
                    return await listProducts({
                      status: 1,
                      page: 1,
                      size: 1000,
                      //product_code: keyWords,
                    }).then(async (response) => {
                      console.log(response);
                      return await response.data.map((product: any) => {
                        return { label: product.product_name, value: product._id };
                      });
                    });
                  }}
                />
                <ProFormSelect
                  name="business_id"
                  label="Customer"
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
      <ProFormSelect
        options={[
          { value: 'LED', label: 'LED' },
          { value: 'BILLBOARD', label: 'BILLBOARD' },
          { value: 'PANO', label: 'Pano' },
          { value: 'BANNER', label: 'Banner' },
          { value: 'BANDROLL', label: 'Bandroll' },
          { value: 'POSM', label: 'POSM' },
          { value: 'TRIVISION', label: 'TRIVISION' },
          { value: 'LIGHT_BOX', label: 'LIGHT BOX' },
          { value: 'LCD_FRAME', label: 'LCD/FRAME' },
          { value: 'ROADSHOW', label: 'ROADSHOW' },
          { value: 'ACTIVATION', label: 'ACTIVATION' },
          { value: 'TRANSIT_AD', label: 'TRANSIT AD' },
          { value: 'AIRPORT', label: 'AIRPORT' },
          { value: 'METRO_SUBWAY', label: 'METRO/SUBWAY' },
          { value: 'TRAIN_STATION', label: 'TRAIN_STATION' },
          { value: 'STREET_FURNITURE', label: 'STREET FURNITURE' },
          { value: 'CINEMA', label: 'CINEMA' },
          { value: 'MARKET BILLBOARD', label: 'MARKET BILLBOARD' },
          { value: 'OTHERS', label: 'OTHERS' },
        ]}
        name="type_ad"
        label="Type Ad"
        width="md"
        mode="multiple"
      />
      <div style={{ height: 340 }}>
        <Divider plain orientation="left">
          <strong>Description</strong>
        </Divider>
        <ProForm.Item name="description" label="Description">
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
      <ProFormDateTimePicker
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
        mode="multiple"
        request={async ({ keyWords }) => {
          return await listUser({ username: keyWords, size: 100 }).then((response) => {
            return response.data.map((user: any) => {
              return { label: user.username, value: user._id };
            });
          });
        }}
      />
      {/* <ProFormSelect
        name="assigned_by"
        label="Assigned By"
        request={async () => {
          return await listUser({}).then((response) => {
            return response.data.map((user: any) => {
              return { label: user.username, value: user._id };
            });
          });
        }}
      /> */}
    </ModalForm>
  );
};

export default ModalCreateTask;
