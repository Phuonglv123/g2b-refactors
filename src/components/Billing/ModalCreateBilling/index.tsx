import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button } from 'antd';

const ModalCreateBilling = () => {
  return (
    <ModalForm trigger={<Button type="primary">New Bill</Button>}>
      <ProFormText width="md" name="name" label="Name" />
      <ProFormTextArea width="md" name="description" label="Description" />
    </ModalForm>
  );
};

export default ModalCreateBilling;
