import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

const ModalCreateTask = () => {
  return (
    <ModalForm>
      <ProFormText name="title" label="Title" />
      <ProFormTextArea name="content" label="Content" />
    </ModalForm>
  );
};

export default ModalCreateTask;
