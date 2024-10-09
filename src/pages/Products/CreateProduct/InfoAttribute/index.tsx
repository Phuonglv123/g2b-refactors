import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
  ProFormTimePicker,
} from '@ant-design/pro-components';

const InfoAttribute = () => {
  return (
    <ProForm.Group title="Attributes" rowProps={{ gutter: 0, justify: 'space-between' }}>
      <ProFormDigit
        name="width"
        label="Width"
        width="md"
        fieldProps={{
          suffix: 'm',
          // formatter: (value) =>
          //   value ? new Intl.NumberFormat('vi-VN').format(Number(value)) : '0',
          // parser: (value: any) => value?.toString().replace(/\./g, '') || '0',
        }}
        rules={[
          {
            required: true,
            message: 'Please input width!',
          },
        ]}
      />
      <ProFormDigit
        name="height"
        label="Height"
        width="md"
        fieldProps={{
          suffix: 'm',
          // formatter: (value) =>
          //   value ? new Intl.NumberFormat('vi-VN').format(Number(value)) : '0',
          // parser: (value: any) => value?.toString().replace(/\./g, '') || '0',
        }}
        rules={[
          {
            required: true,
            message: 'Please input height!',
          },
        ]}
      />
      <ProFormDigit
        name="video_duration"
        label="Video duration"
        width="md"
        fieldProps={{ suffix: 's' }}
        rules={[
          {
            required: true,
            message: 'Please input video duration!',
          },
        ]}
      />
      <ProFormDigit
        name="pixel_width"
        label="Width pixel"
        width="md"
        fieldProps={{ suffix: 'Pixel' }}
        rules={[
          {
            required: true,
            message: 'Please input width pixel!',
          },
        ]}
      />
      <ProFormDigit
        name="pixel_height"
        label="Height pixel"
        width="md"
        fieldProps={{ suffix: 'Pixel' }}
        rules={[
          {
            required: true,
            message: 'Please input height pixel!',
          },
        ]}
      />
      <ProFormDigit
        width="md"
        fieldProps={{ suffix: 'Spot' }}
        name="frequency"
        label="Frequency"
        rules={[
          {
            required: true,
            message: 'Please input frequency!',
          },
        ]}
      />
      <ProFormTimePicker
        name="opera_time_from"
        label="Opera time from"
        width="md"
        rules={[
          {
            required: true,
            message: 'Please input opera time from!',
          },
        ]}
      />
      <ProFormTimePicker
        name="opera_time_to"
        label="Opera time to"
        width="md"
        rules={[
          {
            required: true,
            message: 'Please input opera time to!',
          },
        ]}
      />

      <ProFormSelect
        options={[
          {
            label: 'Curved shape',
            value: 'Curved shape',
          },
          {
            label: 'Straight shape',
            value: 'Straight shape',
          },
          {
            label: 'L shape',
            value: 'L shape',
          },
          {
            label: 'Horizontal shape',
            value: 'Horizontal shape',
          },
          {
            label: 'Vertical shape',
            value: 'Vertical shape',
          },
        ]}
        width="md"
        name="shape"
        label="Shape"
        rules={[
          {
            required: true,
            message: 'Please input shape!',
          },
        ]}
      />
      <ProFormDigit
        width="md"
        name="add_side"
        label="Ad Side"
        rules={[
          {
            required: true,
            message: 'Please input ad side!',
          },
        ]}
      />
      <ProFormTextArea name="note" label="Note" width={1050} />
    </ProForm.Group>
  );
};
export default InfoAttribute;
